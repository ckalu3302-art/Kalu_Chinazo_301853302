-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. staff pk. Expected: pk_staff, SQLSTATE 23505.
INSERT INTO portfolio."staff" ("staff_id", "display_name")
VALUES (1, 'Morgan Park');

-- 2. staff display not null. Expected: display_name, SQLSTATE 23502.
INSERT INTO portfolio."staff" ("staff_id", "display_name")
VALUES (101, NULL);

-- 3. bus pk. Expected: pk_bus, SQLSTATE 23505.
INSERT INTO portfolio."bus" ("bus_id", "fleet_code", "capacity")
VALUES (3, 'FLEET-102', 30);

-- 4. bus fleet unique. Expected: uq_bus_0, SQLSTATE 23505.
INSERT INTO portfolio."bus" ("bus_id", "fleet_code", "capacity")
VALUES (102, 'FLEET-101', 30);

-- 5. departure pk. Expected: pk_departure, SQLSTATE 23505.
INSERT INTO portfolio."departure" ("departure_id", "bus_id", "depart_at")
VALUES (4, 3, '2026-11-17T08:00:00Z');

-- 6. departure bus fk. Expected: fk_departure_0, SQLSTATE 23503.
INSERT INTO portfolio."departure" ("departure_id", "bus_id", "depart_at")
VALUES (103, 999, '2026-11-17T08:00:00Z');

-- 7. seat pick pk. Expected: pk_seat_pick, SQLSTATE 23505.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (5, 1, 4, 3, '2026-11-15T17:00:00Z');

-- 8. seat departure seat unique. Expected: uq_seat_pick_0, SQLSTATE 23505.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (104, 2, 4, 1, '2026-11-15T17:10:00Z');

-- 9. seat departure staff unique. Expected: uq_seat_pick_1, SQLSTATE 23505.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (105, 1, 4, 3, '2026-11-15T17:15:00Z');

-- 10. seat staff fk. Expected: fk_seat_pick_0, SQLSTATE 23503.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (106, 999, 4, 3, '2026-11-15T17:20:00Z');

-- 11. seat departure fk. Expected: fk_seat_pick_1, SQLSTATE 23503.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (107, 1, 999, 3, '2026-11-15T17:25:00Z');

-- 12. bus capacity check. Expected: bus_capacity_positive, SQLSTATE 23514.
INSERT INTO portfolio."bus" ("bus_id", "fleet_code", "capacity")
VALUES (108, 'FLEET-108', 0);

-- 13. seat number check. Expected: seat_number_positive, SQLSTATE 23514.
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at")
VALUES (109, 1, 4, 0, '2026-11-15T17:30:00Z');
