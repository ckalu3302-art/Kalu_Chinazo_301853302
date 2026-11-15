# Daily Staff Commute Seat Picker — SQL queries

## 1. Show related seat_pick, staff, departure, bus records (up to 20).

```sql
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
```

| seat_pick_pick_id | seat_pick_seat_no | staff_staff_id | staff_display_name | departure_departure_id | departure_depart_at | bus_bus_id | bus_fleet_code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 1 | 1 | Avery Chen | 4 | 2026-11-16T08:00:00+00:00 | 3 | FLEET-101 |
| 6 | 2 | 2 | Jordan Lee | 4 | 2026-11-16T08:00:00+00:00 | 3 | FLEET-101 |

## 2. Find departure records where bus_id matches 3 (up to 20).

```sql
SELECT * FROM portfolio."departure"
WHERE "bus_id" IS NOT DISTINCT FROM 3
ORDER BY "departure_id"
LIMIT 20;
```

| departure_id | bus_id | depart_at |
| --- | --- | --- |
| 4 | 3 | 2026-11-16T08:00:00+00:00 |

## 3. Count departure records for each bus_id (up to 20 groups).

```sql
SELECT "bus_id", count(*) AS record_count
FROM portfolio."departure"
GROUP BY "bus_id"
ORDER BY record_count DESC, "bus_id" NULLS LAST
LIMIT 20;
```

| bus_id | record_count |
| --- | --- |
| 3 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 0.851 | 1.325, 0.851, 0.845 | Sort → Seq Scan | 112 |
| After index | 0.197 | 0.202, 0.19, 0.197 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 0.851 ms to 0.197 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.283..1.285 rows=20 loops=1)
  Seq Scan on seat_pick (actual time=0.028..1.231 rows=20 loops=1)
Planning Time: 0.55 ms
Execution Time: 1.325 ms
```

### Before index, run 2

```text
Sort (actual time=0.821..0.823 rows=20 loops=1)
  Seq Scan on seat_pick (actual time=0.019..0.786 rows=20 loops=1)
Planning Time: 0.318 ms
Execution Time: 0.851 ms
```

### Before index, run 3

```text
Sort (actual time=0.817..0.819 rows=20 loops=1)
  Seq Scan on seat_pick (actual time=0.018..0.785 rows=20 loops=1)
Planning Time: 0.313 ms
Execution Time: 0.845 ms
```

### After index, run 1

```text
Sort (actual time=0.144..0.145 rows=20 loops=1)
  Bitmap Heap Scan on seat_pick (actual time=0.035..0.1 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.018..0.018 rows=20 loops=1)
Planning Time: 0.513 ms
Execution Time: 0.202 ms
```

### After index, run 2

```text
Sort (actual time=0.133..0.135 rows=20 loops=1)
  Bitmap Heap Scan on seat_pick (actual time=0.035..0.099 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.018..0.018 rows=20 loops=1)
Planning Time: 0.511 ms
Execution Time: 0.19 ms
```

### After index, run 3

```text
Sort (actual time=0.136..0.137 rows=20 loops=1)
  Bitmap Heap Scan on seat_pick (actual time=0.036..0.102 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.018..0.018 rows=20 loops=1)
Planning Time: 0.509 ms
Execution Time: 0.197 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Kalu_Chinazo_301853302_P2_Queries.sql, then Kalu_Chinazo_301853302_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Kalu_Chinazo_301853302_P2_QueryResults.png) · [Index comparison](screenshots/Kalu_Chinazo_301853302_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

