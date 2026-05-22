"""sabaleticas — small CLI for the Hacienda Sabaleticas data layer.

Stdlib only (argparse + urllib + sqlite3). `prices fetch` also needs the
`pdftotext` system binary (poppler).

  sabaleticas build          rebuild sabaleticas.db from data/*.csv
  sabaleticas prices show    show current market-price benchmarks
  sabaleticas prices fetch   pull latest Central Ganadera boletín -> price_benchmarks.csv
  sabaleticas movements      summarize GSMI sales cadence & channels

(Also runnable without install: `python -m sabaleticas ...` or `uv run sabaleticas ...`.)
"""
import argparse, csv, os, re, sqlite3, subprocess, sys, tempfile, urllib.request
from datetime import date
from pathlib import Path

UA = "Mozilla/5.0 (sabaleticas-cli; +sabaleticas advisory)"
CG_INDEX = "https://centralganadera.com/boletines/precios-oficiales/"
MESES = {"enero":1,"febrero":2,"marzo":3,"abril":4,"mayo":5,"junio":6,"julio":7,
         "agosto":8,"septiembre":9,"setiembre":9,"octubre":10,"noviembre":11,"diciembre":12}


def find_root() -> Path:
    """Locate the project root (the dir holding data/schema.sql)."""
    env = os.environ.get("SABALETICAS_ROOT")
    if env and (Path(env) / "data" / "schema.sql").exists():
        return Path(env)
    for base in (Path.cwd(), Path(__file__).resolve().parent):
        for d in (base, *base.parents):
            if (d / "data" / "schema.sql").exists():
                return d
    sys.exit("error: could not find the project root (no data/schema.sql). "
             "Run from inside the repo or set SABALETICAS_ROOT.")


ROOT = find_root()
DATA = ROOT / "data"
DB = ROOT / "sabaleticas.db"
BENCH_CSV = DATA / "price_benchmarks.csv"


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read() if binary else r.read().decode("utf-8", "replace")


# ---------------------------------------------------------------- build
def cmd_build(_):
    r = sh(["bash", str(ROOT / "scripts" / "build_db.sh")])
    sys.stdout.write(r.stdout); sys.stderr.write(r.stderr)
    return r.returncode


# ---------------------------------------------------------------- prices show
def cmd_prices_show(_):
    if not DB.exists():
        print("sabaleticas.db missing — run: sabaleticas build"); return 1
    con = sqlite3.connect(DB)
    rows = con.execute("""
        SELECT category, region, cop_per_kg, obs_date, source FROM price_benchmarks b
        WHERE obs_date = (SELECT MAX(obs_date) FROM price_benchmarks x
                          WHERE x.category=b.category AND x.region=b.region AND x.source=b.source)
        ORDER BY category, region""").fetchall()
    if not rows:
        print("No benchmarks yet — run: sabaleticas prices fetch"); return 0
    print(f"{'category':18} {'region':12} {'COP/kg':>8}  {'date':10}  source")
    print("-" * 72)
    for cat, reg, cop, d, src in rows:
        print(f"{cat:18} {reg:12} {int(cop):>8,}  {d:10}  {src}")
    return 0


# ---------------------------------------------------------------- prices fetch
def latest_boletin_url():
    html = get(CG_INDEX)
    pdfs = re.findall(r'href="([^"]+PRECIOS[-_]OFICIALES[^"]+\.pdf)"', html, re.I)
    if not pdfs:
        pdfs = re.findall(r'href="([^"]+wp-content/uploads/[^"]+\.pdf)"', html, re.I)
    if not pdfs:
        return None

    def keyf(u):
        m = re.search(r'/(\d{4})/(\d{2})/(\d+)_', u)
        return (m.group(1), m.group(2), int(m.group(3))) if m else ("0", "0", 0)

    return sorted(set(pdfs), key=keyf)[-1]


def parse_boletin(text, url):
    """Return list of (category, cop_per_kg, note, obs_date) from boletín text."""
    obs = date.today().isoformat()
    m = re.search(r'_(\d{1,2})_al_(\d{1,2})_([A-Za-zÁÉÍÓÚáéíóú]+)_(\d{4})', url)
    if m:
        mes = MESES.get(m.group(3).lower())
        if mes:
            obs = f"{m.group(4)}-{mes:02d}-{int(m.group(2)):02d}"
    bnum = (re.search(r'/(\d+)_PRECIOS', url) or [None, "?"])[1]
    wanted = {"Machos Cebados": "macho cebado", "Hembras Cebadas": "hembra cebada"}
    out = []
    for line in text.splitlines():
        for label, cat in wanted.items():
            if label.lower() in line.lower():
                nums = [int(n.replace(".", "").replace(",", ""))
                        for n in re.findall(r'\d[\d.,]{2,}', line)]
                prices = [n for n in nums if 3000 <= n <= 30000]
                if len(prices) >= 3:
                    out.append((cat, prices[-1], f"Boletin N{bnum}; range {min(prices)}-{max(prices)} [S37]", obs))
    return out


def cmd_prices_fetch(args):
    url = latest_boletin_url()
    if not url:
        print("Could not find a boletín PDF on the index page."); return 1
    print(f"Latest boletín: {url}")
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(get(url, binary=True)); pdf = f.name
    txt = sh(["pdftotext", "-layout", pdf, "-"]).stdout
    os.unlink(pdf)
    parsed = parse_boletin(txt, url)
    if not parsed:
        print("Parsed 0 rows — the boletín layout may have changed. Inspect manually."); return 1
    for cat, cop, _note, obs in parsed:
        print(f"  {obs}  {cat:14} {cop:>7,} COP/kg")
    if args.dry_run:
        print("(dry-run — not written)"); return 0
    existing = {(r["obs_date"], r["category"], r["source"]) for r in csv.DictReader(open(BENCH_CSV))}
    src, added = "Central Ganadera Medellin", 0
    with open(BENCH_CSV, "a", newline="") as f:
        w = csv.writer(f)
        for cat, cop, note, obs in parsed:
            if (obs, cat, src) in existing:
                continue
            w.writerow([obs, src, cat, "Medellin", "", cop, note]); added += 1
    print(f"Added {added} new row(s) to {BENCH_CSV.relative_to(ROOT)}.")
    if added:
        cmd_build(None)
    return 0


# ---------------------------------------------------------------- movements
def cmd_movements(_):
    if not DB.exists():
        print("sabaleticas.db missing — run: sabaleticas build"); return 1
    con = sqlite3.connect(DB)
    valid = "estado != 'ANULADA'"
    n = con.execute(f"SELECT COUNT(*) FROM gsmi_movements WHERE {valid}").fetchone()[0]
    span = con.execute(f"SELECT MIN(mov_date), MAX(mov_date) FROM gsmi_movements WHERE {valid}").fetchone()
    print(f"{n} valid movements, {span[0]} .. {span[1]}")
    print("\nChannel handler:")
    for h, c in con.execute(f"""SELECT CASE WHEN resp_origen LIKE 'SILVIA%' THEN 'owner direct'
        ELSE 'comisionista' END, COUNT(*) FROM gsmi_movements WHERE {valid} GROUP BY 1 ORDER BY 2 DESC"""):
        print(f"  {h:14} {c}")
    print("\nTop destinations:")
    for d, c in con.execute(f"SELECT destino, COUNT(*) FROM gsmi_movements WHERE {valid} GROUP BY destino ORDER BY 2 DESC LIMIT 5"):
        print(f"  {c:3}  {d}")
    return 0


def main():
    p = argparse.ArgumentParser(prog="sabaleticas", description="Hacienda Sabaleticas data CLI")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("build", help="rebuild sabaleticas.db from data/*.csv").set_defaults(fn=cmd_build)
    pr = sub.add_parser("prices", help="market price benchmarks").add_subparsers(dest="sub", required=True)
    pr.add_parser("show", help="show current benchmarks").set_defaults(fn=cmd_prices_show)
    pf = pr.add_parser("fetch", help="pull latest Central Ganadera boletín")
    pf.add_argument("--dry-run", action="store_true", help="parse and print, don't write")
    pf.set_defaults(fn=cmd_prices_fetch)
    sub.add_parser("movements", help="GSMI sales cadence & channels").set_defaults(fn=cmd_movements)
    args = p.parse_args()
    sys.exit(args.fn(args))


if __name__ == "__main__":
    main()
