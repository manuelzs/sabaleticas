-- Hacienda Sabaleticas — SQLite schema.
-- Canonical data lives in the CSV files; this builds the queryable DB from them.
-- All money in COP, all weights in kg.

PRAGMA foreign_keys = ON;

CREATE TABLE sources (
    id        TEXT PRIMARY KEY,   -- short slug, e.g. "finca-el-rosario"
    name      TEXT NOT NULL,
    location  TEXT,
    channel   TEXT,               -- feria / subasta / comisionista / directo
    notes     TEXT
);

CREATE TABLE lotes (
    id             TEXT PRIMARY KEY,   -- e.g. "2026-01-rosario-01"
    source_id      TEXT REFERENCES sources(id),
    purchase_date  TEXT,               -- YYYY-MM-DD
    head           INTEGER,
    entry_kg_total REAL,
    price_total    REAL,               -- COP paid for the lote
    price_per_kg   REAL,               -- COP/kg at purchase
    notes          TEXT
);

CREATE TABLE animals (
    tag           TEXT PRIMARY KEY,
    lote_id       TEXT REFERENCES lotes(id),
    sex           TEXT,
    breed         TEXT,
    entry_weight  REAL,
    entry_date    TEXT,
    status        TEXT DEFAULT 'active',  -- active / sold / dead
    exit_date     TEXT
);

CREATE TABLE weighings (
    id        INTEGER PRIMARY KEY,
    tag       TEXT REFERENCES animals(tag),
    date      TEXT,
    weight_kg REAL,
    notes     TEXT
);

CREATE TABLE sales (
    id            INTEGER PRIMARY KEY,
    lote_id       TEXT REFERENCES lotes(id),
    sale_date     TEXT,
    buyer         TEXT,
    head          INTEGER,
    exit_kg_total REAL,
    price_per_kg  REAL,
    total         REAL                   -- COP received
);

CREATE TABLE costs (
    id          INTEGER PRIMARY KEY,
    date        TEXT,
    category    TEXT,                     -- health / feed / transport / labor / pasture / admin
    description TEXT,
    amount      REAL,                     -- COP
    lote_id     TEXT REFERENCES lotes(id) -- NULL = operation-level (allocated later)
);

-- ---------------------------------------------------------------------------
-- Analytical views — the questions we actually ask
-- ---------------------------------------------------------------------------

-- Latest weight + gain + ADG per animal
CREATE VIEW animal_gain AS
WITH latest AS (
    SELECT tag, weight_kg, date,
           ROW_NUMBER() OVER (PARTITION BY tag ORDER BY date DESC) AS rn
    FROM weighings
)
SELECT a.tag, a.lote_id,
       a.entry_weight,
       l.weight_kg                                   AS latest_weight,
       l.date                                        AS latest_date,
       l.weight_kg - a.entry_weight                  AS kg_gained,
       julianday(l.date) - julianday(a.entry_date)   AS days_on_farm,
       ROUND((l.weight_kg - a.entry_weight) /
             NULLIF(julianday(l.date) - julianday(a.entry_date), 0), 3) AS gdp
FROM animals a
LEFT JOIN latest l ON l.tag = a.tag AND l.rn = 1;

-- Margin per lote: sale revenue − purchase − directly-allocated costs
CREATE VIEW lote_margin AS
SELECT
    lo.id                                            AS lote_id,
    lo.source_id,
    lo.head,
    lo.price_total                                   AS purchase_cost,
    COALESCE((SELECT SUM(amount) FROM costs c WHERE c.lote_id = lo.id), 0) AS allocated_costs,
    COALESCE((SELECT SUM(total)  FROM sales s WHERE s.lote_id = lo.id), 0) AS sale_revenue,
    COALESCE((SELECT SUM(total)  FROM sales s WHERE s.lote_id = lo.id), 0)
        - lo.price_total
        - COALESCE((SELECT SUM(amount) FROM costs c WHERE c.lote_id = lo.id), 0) AS margin
FROM lotes lo;

-- Source leaderboard: which proveedores give the best margin (only on closed lotes)
CREATE VIEW source_leaderboard AS
SELECT
    s.id                          AS source_id,
    s.name,
    COUNT(m.lote_id)              AS lotes,
    SUM(m.head)                   AS head,
    SUM(m.margin)                 AS total_margin,
    ROUND(SUM(m.margin) * 1.0 / NULLIF(SUM(m.head), 0)) AS margin_per_head
FROM sources s
LEFT JOIN lote_margin m ON m.source_id = s.id
WHERE m.sale_revenue > 0          -- closed lotes only
GROUP BY s.id, s.name
ORDER BY margin_per_head DESC;
