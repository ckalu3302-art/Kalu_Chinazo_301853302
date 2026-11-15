-- Daily Staff Commute Seat Picker: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."staff" (
  "staff_id" bigint NOT NULL,
  "display_name" text NOT NULL,
  CONSTRAINT "pk_staff" PRIMARY KEY ("staff_id")
);
CREATE TABLE portfolio."bus" (
  "bus_id" bigint NOT NULL,
  "fleet_code" text NOT NULL,
  "capacity" bigint NOT NULL,
  CONSTRAINT "pk_bus" PRIMARY KEY ("bus_id"),
  CONSTRAINT "uq_bus_0" UNIQUE ("fleet_code")
);
CREATE TABLE portfolio."departure" (
  "departure_id" bigint NOT NULL,
  "bus_id" bigint NOT NULL,
  "depart_at" timestamptz NOT NULL,
  CONSTRAINT "pk_departure" PRIMARY KEY ("departure_id")
);
CREATE TABLE portfolio."seat_pick" (
  "pick_id" bigint NOT NULL,
  "staff_id" bigint NOT NULL,
  "departure_id" bigint NOT NULL,
  "seat_no" bigint NOT NULL,
  "picked_at" timestamptz NOT NULL,
  CONSTRAINT "pk_seat_pick" PRIMARY KEY ("pick_id"),
  CONSTRAINT "uq_seat_pick_0" UNIQUE ("departure_id", "seat_no"),
  CONSTRAINT "uq_seat_pick_1" UNIQUE ("departure_id", "staff_id")
);
ALTER TABLE portfolio."departure" ADD CONSTRAINT "fk_departure_0" FOREIGN KEY ("bus_id") REFERENCES portfolio."bus" ("bus_id");
ALTER TABLE portfolio."seat_pick" ADD CONSTRAINT "fk_seat_pick_0" FOREIGN KEY ("staff_id") REFERENCES portfolio."staff" ("staff_id");
ALTER TABLE portfolio."seat_pick" ADD CONSTRAINT "fk_seat_pick_1" FOREIGN KEY ("departure_id") REFERENCES portfolio."departure" ("departure_id");
ALTER TABLE portfolio."bus" ADD CONSTRAINT "bus_capacity_positive" CHECK ("capacity" > 0);
ALTER TABLE portfolio."seat_pick" ADD CONSTRAINT "seat_number_positive" CHECK ("seat_no" > 0);
COMMIT;
