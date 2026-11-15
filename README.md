# Chinazo Kalu — MIT 8103

Student ID: 301853302

Daily Staff Commute Seat Picker. Entities: Staff, Bus, Departure, SeatPick. A departure references a bus; each pick references a staff member and departure. UNIQUE(departure_id, seat_no) prevents duplicate seat picks. Query occupied seats by departure and compare with bus capacity. A SQL transaction inserts a pick; MongoDB logs a snapshot with the pick, staff, departure, and bus.

The portfolio is being generated. Completed stages will appear in the commit history.
