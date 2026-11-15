# Daily Staff Commute Seat Picker — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| staff_id | seat_pick records (list) |
| --- | --- |
| 1 | [5] |
| 2 | [6] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| seat_pick.pick_id | seat_pick.staff_id | seat_pick.departure_id | staff.staff_id | staff.display_name | departure.departure_id | departure.bus_id | bus.bus_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 1 | 4 | 1 | Avery Chen | 4 | 3 | 3 |
| 6 | 2 | 4 | 2 | Jordan Lee | 4 | 3 | 3 |

Key: pick_id.

## 2NF: depend on the whole key

seat_pick: staff_id is a proper part of candidate key (departure_id, staff_id), and determines staff details. seat_pick: departure_id is a proper part of candidate key (departure_id, seat_no), and determines departure details.

## staff_example

| staff.staff_id | staff.display_name |
| --- | --- |
| 1 | Avery Chen |
| 2 | Jordan Lee |

## departure_example

| departure.departure_id | departure.bus_id | bus.bus_id |
| --- | --- | --- |
| 4 | 3 | 3 |

## seat_pick_example

| seat_pick.pick_id | seat_pick.staff_id | seat_pick.departure_id |
| --- | --- | --- |
| 5 | 1 | 4 |
| 6 | 2 | 4 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## staff

| staff_id | display_name |
| --- | --- |
| 1 | Avery Chen |
| 2 | Jordan Lee |

## bus

| bus_id | fleet_code | capacity |
| --- | --- | --- |
| 3 | FLEET-101 | 40 |

## departure

| departure_id | bus_id | depart_at |
| --- | --- | --- |
| 4 | 3 | 2026-11-16T08:00:00+00:00 |

## seat_pick

| pick_id | staff_id | departure_id | seat_no | picked_at |
| --- | --- | --- | --- | --- |
| 5 | 1 | 4 | 1 | 2026-11-15T16:00:00+00:00 |
| 6 | 2 | 4 | 2 | 2026-11-15T16:05:00+00:00 |

## Dependencies

- staff: (staff_id) → display_name
- bus: (bus_id) → fleet_code, capacity
- departure: (departure_id) → bus_id, depart_at
- seat_pick: (pick_id) → staff_id, departure_id, seat_no, picked_at

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
