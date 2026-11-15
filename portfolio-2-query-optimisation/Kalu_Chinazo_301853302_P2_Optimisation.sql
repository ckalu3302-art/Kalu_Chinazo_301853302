-- A separate performance table using the case's seat_pick.departure_id type.
-- Only this field and a lab row ID are copied. Business constraints stay in Portfolio 1.
-- Generated values are for measuring a selective lookup, not complete case records.
CREATE SCHEMA query_lab;
CREATE TABLE query_lab."seat_pick" AS
SELECT "departure_id", 0::bigint AS "lab_row_id" FROM portfolio."seat_pick" WITH NO DATA;
INSERT INTO query_lab."seat_pick" ("departure_id", "lab_row_id")
SELECT (g % 1000)::bigint, g FROM generate_series(1, 20000) AS g;
ANALYZE query_lab."seat_pick";

-- Before: warm the lookup, then measure it three times.
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";

CREATE INDEX p2_filter_idx ON query_lab."seat_pick" USING btree ("departure_id");

-- After: run the same lookup and repeat the measurements.
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
EXPLAIN (ANALYZE, BUFFERS)
SELECT "lab_row_id", "departure_id"
FROM query_lab."seat_pick"
WHERE "departure_id" = (42 % 1000)::bigint
ORDER BY "lab_row_id";
