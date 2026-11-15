-- Fictional sample records for Daily Staff Commute Seat Picker.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."staff" ("staff_id", "display_name") VALUES (1, 'Avery Chen');
INSERT INTO portfolio."staff" ("staff_id", "display_name") VALUES (2, 'Jordan Lee');
INSERT INTO portfolio."bus" ("bus_id", "fleet_code", "capacity") VALUES (3, 'FLEET-101', 40);
INSERT INTO portfolio."departure" ("departure_id", "bus_id", "depart_at") VALUES (4, 3, '2026-11-16T08:00:00Z');
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at") VALUES (5, 1, 4, 1, '2026-11-15T16:00:00Z');
INSERT INTO portfolio."seat_pick" ("pick_id", "staff_id", "departure_id", "seat_no", "picked_at") VALUES (6, 2, 4, 2, '2026-11-15T16:05:00Z');
COMMIT;
