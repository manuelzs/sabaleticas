"""One-time migration: give every entity a globally unique, namespaced id.

`rompecargas` is unique inside the water graph and will not stay unique once
potreros and lotes exist — and a reading, a ticket or an alert that points at a bare
id has no way to say which subsystem it meant. Prefixing costs nothing today and is
a migration once anything references the old ids.

Format: `<subsistema>:<id-local>` — agua:rompecargas, ganado:hato, predio:finca.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NET = ROOT / "operations/land/geo/water-network.json"
READ = ROOT / "data/readings.csv"
SRC = ROOT / "operations/sensors/sources.json"

# entities that live outside the water graph
EXTRA = {"hato": "ganado:hato", "finca": "predio:finca"}


def main():
    net = json.loads(NET.read_text(encoding="utf-8"))
    if net["nodes"] and ":" in net["nodes"][0]["id"]:
        print("  already namespaced — nothing to do")
        return
    m = {n["id"]: f"agua:{n['id']}" for n in net["nodes"]}
    m.update(EXTRA)

    for n in net["nodes"]:
        n["id"] = m[n["id"]]
    for e in net["edges"]:
        e["from"], e["to"] = m[e["from"]], m[e["to"]]
        e["id"] = f"{e['from']}--{e['to']}"
    net["meta"]["ids"] = (
        "Los ids son GLOBALES: <subsistema>:<id-local>. Sin el prefijo, un potrero y "
        "una T podrían llamarse igual, y una lectura o un aviso apuntando a 't-1' no "
        "tendría forma de decir a cuál. El prefijo es el nombre de la pestaña: agua, "
        "ganado, predio.")
    NET.write_text(json.dumps(net, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"  water-network: {len(net['nodes'])} nodes, {len(net['edges'])} edges")

    rows = list(csv.DictReader(READ.open(encoding="utf-8")))
    for r in rows:
        r["entidad"] = m.get(r["entidad"], r["entidad"])
    with READ.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(rows)
    print(f"  readings: {len(rows)} rows → {sorted({r['entidad'] for r in rows})}")

    src = json.loads(SRC.read_text(encoding="utf-8"))
    for fu in src["fuentes"]:
        if fu.get("entidad"):
            fu["entidad"] = m.get(fu["entidad"], fu["entidad"])
    src["meta"]["ids"] = "Las entidades usan ids globales: <subsistema>:<id-local>."
    SRC.write_text(json.dumps(src, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"  sources: {sorted({f['entidad'] for f in src['fuentes'] if f.get('entidad')})}")

    unmapped = [v for v in m.values() if not v.count(":")]
    if unmapped:
        print("  ⚠ unmapped:", unmapped)


if __name__ == "__main__":
    main()
