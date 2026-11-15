-- Show related seat_pick, staff, departure, bus records (up to 20).
SELECT t0."pick_id" AS "seat_pick_pick_id",
       t0."seat_no" AS "seat_pick_seat_no",
       t1."staff_id" AS "staff_staff_id",
       t1."display_name" AS "staff_display_name",
       t2."departure_id" AS "departure_departure_id",
       t2."depart_at" AS "departure_depart_at",
       t3."bus_id" AS "bus_bus_id",
       t3."fleet_code" AS "bus_fleet_code"
FROM portfolio."seat_pick" t0
JOIN portfolio."staff" t1 ON t0."staff_id" = t1."staff_id"
JOIN portfolio."departure" t2 ON t0."departure_id" = t2."departure_id"
JOIN portfolio."bus" t3 ON t2."bus_id" = t3."bus_id"
ORDER BY t0."pick_id", t1."staff_id", t2."departure_id", t3."bus_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."pick_id" AS "seat_pick_pick_id",
       t0."seat_no" AS "seat_pick_seat_no",
       t1."staff_id" AS "staff_staff_id",
       t1."display_name" AS "staff_display_name",
       t2."departure_id" AS "departure_departure_id",
       t2."depart_at" AS "departure_depart_at",
       t3."bus_id" AS "bus_bus_id",
       t3."fleet_code" AS "bus_fleet_code"
FROM portfolio."seat_pick" t0
JOIN portfolio."staff" t1 ON t0."staff_id" = t1."staff_id"
JOIN portfolio."departure" t2 ON t0."departure_id" = t2."departure_id"
JOIN portfolio."bus" t3 ON t2."bus_id" = t3."bus_id"
ORDER BY t0."pick_id", t1."staff_id", t2."departure_id", t3."bus_id"
LIMIT 20;

-- Find departure records where bus_id matches 3 (up to 20).
SELECT * FROM portfolio."departure"
WHERE "bus_id" IS NOT DISTINCT FROM 3
ORDER BY "departure_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."departure"
WHERE "bus_id" IS NOT DISTINCT FROM 3
ORDER BY "departure_id"
LIMIT 20;

-- Count departure records for each bus_id (up to 20 groups).
SELECT "bus_id", count(*) AS record_count
FROM portfolio."departure"
GROUP BY "bus_id"
ORDER BY record_count DESC, "bus_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "bus_id", count(*) AS record_count
FROM portfolio."departure"
GROUP BY "bus_id"
ORDER BY record_count DESC, "bus_id" NULLS LAST
LIMIT 20;
