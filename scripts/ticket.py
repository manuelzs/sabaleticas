#!/usr/bin/env python3
"""Open, list and close work tickets.

Two fields, by Manuel's rule: what it is about, and what needs doing. No priority, no
status, no assignee. A ticket that exists is a ticket that is open; closing it deletes
the line, and git keeps the history — which is the one place history maintains itself.

    python3 scripts/ticket.py abrir agua:t-2 "medir dónde está de verdad"
    python3 scripts/ticket.py abrir --punto -75.6031 5.7945 --donde "esquina Mojón 4" "..."
    python3 scripts/ticket.py listar [texto de búsqueda]
    python3 scripts/ticket.py cerrar T-014
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORE = ROOT / "operations" / "trabajo" / "tickets.json"
HOY = "2026-08-22"


def cargar():
    return json.loads(STORE.read_text(encoding="utf-8"))


def guardar(d):
    STORE.write_text(json.dumps(d, indent=1, ensure_ascii=False), encoding="utf-8")


def siguiente(d):
    n = 0
    for t in d["tickets"]:
        try:
            n = max(n, int(t["id"].split("-")[1]))
        except (IndexError, ValueError):
            pass
    return f"T-{n + 1:03d}"


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    d = cargar()

    if cmd == "abrir":
        t = {"id": siguiente(d), "abierto": HOY}
        if args and args[0] == "--punto":
            t["punto"] = [float(args[1]), float(args[2])]
            args = args[3:]
            if args and args[0] == "--donde":
                t["donde"] = args[1]
                args = args[2:]
        else:
            t["sobre"] = args[0]
            args = args[1:]
        if not args:
            raise SystemExit("error: falta el texto del tiquete")
        t["texto"] = " ".join(args)
        d["tickets"].append(t)
        guardar(d)
        print(f"{t['id']} abierto · {t.get('sobre') or t.get('donde')} · {t['texto']}")

    elif cmd == "listar":
        q = " ".join(args).lower()
        for t in d["tickets"]:
            linea = f"{t['id']}  {t.get('sobre') or t.get('donde', '—'):28s}  {t['texto']}"
            if not q or q in linea.lower():
                print(linea)
        print(f"\n{len(d['tickets'])} tiquete(s) abiertos")

    elif cmd == "cerrar":
        antes = len(d["tickets"])
        d["tickets"] = [t for t in d["tickets"] if t["id"] not in args]
        if len(d["tickets"]) == antes:
            raise SystemExit(f"error: no encontré {', '.join(args)}")
        guardar(d)
        print(f"cerrado(s): {', '.join(args)} · quedan {len(d['tickets'])}")

    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
