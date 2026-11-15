# Daily Staff Commute Seat Picker — database design

My case study records staff, bus, departure, seat_pick.

## Users

- Synthetic staff members selecting seats
- Synthetic transport coordinators reviewing departures

## Main operations

- Create a departure for one bus and record a staff member's seat pick.
- List picked seats and compare occupied seats with bus capacity.
- Benchmark a departure_id filter on synthetic data: compare equivalent query plans before and after a B-tree index using 20000 SeatPick rows.

## Entities

| Entity | Information stored |
| --- | --- |
| staff | A staff member eligible to select a commute seat. |
| bus | A bus with a fleet code and seating capacity. |
| departure | A scheduled trip assigned to one bus. |
| seat_pick | A staff member's selected seat on a departure. |

## staff

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| staff_id | BIGINT | PK | Yes |
| display_name | TEXT |  | Yes |


## bus

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| bus_id | BIGINT | PK | Yes |
| fleet_code | TEXT | Unique | Yes |
| capacity | INTEGER |  | Yes |
- Unique key: (fleet_code).

## departure

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| departure_id | BIGINT | PK | Yes |
| bus_id | BIGINT | FK | Yes |
| depart_at | TIMESTAMPTZ |  | Yes |
- bus_id → bus.bus_id

## seat_pick

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| pick_id | BIGINT | PK | Yes |
| staff_id | BIGINT | FK | Yes |
| departure_id | BIGINT | FK | Yes |
| seat_no | INTEGER |  | Yes |
| picked_at | TIMESTAMPTZ |  | Yes |
- staff_id → staff.staff_id
- departure_id → departure.departure_id
- Unique key: (departure_id, seat_no).
- Unique key: (departure_id, staff_id).

## Relationships and business rules

- A bus must have capacity greater than zero.
- Every departure references an existing bus.
- A picked seat number must be greater than zero.
- A departure can have no more than one pick for a given seat number.
- A staff member can have no more than one pick for a given departure.

## Assumptions

- Each departure is one scheduled trip served by exactly one bus.
- Staff, bus, departure, and pick identifiers are globally unique single-column identifiers.
- Seat numbers are positive integers; the bus capacity is a positive integer.
- A staff member may hold at most one seat on a given departure, and a seat may be picked at most once per departure.
- Departure capacity comparison reports occupied picks and bus capacity; it does not imply that a cross-table capacity rule is enforced by a row CHECK.
- A committed relational pick may be represented by an immutable MongoDB snapshot; the snapshot is not the authoritative seat reservation.

