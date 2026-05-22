#!/usr/bin/env bash
# Rebuild ranch.db from the canonical CSVs in data/.
# The DB is derived and disposable — CSVs are the source of truth.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/ranch.db"
DATA="$ROOT/data"

rm -f "$DB"

# Create tables + views from schema.
sqlite3 "$DB" < "$DATA/schema.sql"

# Load each CSV (skip header). Header-only files import 0 rows, which is fine.
for table in sources lotes animals weighings sales costs gsmi_movements price_benchmarks; do
    sqlite3 "$DB" ".mode csv" ".import --skip 1 '$DATA/$table.csv' $table"
done

echo "Built $DB"
sqlite3 "$DB" "SELECT name, (SELECT COUNT(*) FROM sqlite_master) FROM sqlite_master WHERE type='table';" >/dev/null
echo "Row counts:"
for table in sources lotes animals weighings sales costs gsmi_movements price_benchmarks; do
    printf "  %-12s %s\n" "$table" "$(sqlite3 "$DB" "SELECT COUNT(*) FROM $table;")"
done
