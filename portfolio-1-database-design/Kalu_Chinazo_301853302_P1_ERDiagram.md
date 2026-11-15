# Daily Staff Commute Seat Picker — ER diagram

```mermaid
erDiagram
    direction LR
    staff {
        bigint staff_id PK
        text display_name
    }
    bus {
        bigint bus_id PK
        text fleet_code UK
        integer capacity
    }
    departure {
        bigint departure_id PK
        bigint bus_id FK
        timestamptz depart_at
    }
    seat_pick {
        bigint pick_id PK
        bigint staff_id FK
        bigint departure_id FK
        integer seat_no
        timestamptz picked_at
    }
    bus ||--o{ departure : "bus_id"
    staff ||--o{ seat_pick : "staff_id"
    departure ||--o{ seat_pick : "departure_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Kalu_Chinazo_301853302_ERDiagram.png)
