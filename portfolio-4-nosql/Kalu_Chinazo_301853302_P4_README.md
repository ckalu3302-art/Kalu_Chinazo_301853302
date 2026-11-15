# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection seat_pick_events for seat_pick_created and seat_pick_cancelled events. These are fictional event examples based on seat_pick, staff, departure, bus.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related staff, departure, bus details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "seat_pick_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "seat_pick",
        "key": {
            "pick_id": 5
        },
        "snapshot": {
            "pick_id": 5,
            "staff_id": 1,
            "departure_id": 4,
            "seat_no": 1,
            "picked_at": "2026-11-15T16:00:00Z"
        }
    },
    "embedded": {
        "staff": [
            {
                "key": {
                    "staff_id": 1
                },
                "snapshot": {
                    "staff_id": 1,
                    "display_name": "Avery Chen"
                },
                "via": [
                    "seat_pick.staff_id → staff"
                ]
            }
        ],
        "departure": [
            {
                "key": {
                    "departure_id": 4
                },
                "snapshot": {
                    "departure_id": 4,
                    "bus_id": 3,
                    "depart_at": "2026-11-16T08:00:00Z"
                },
                "via": [
                    "seat_pick.departure_id → departure"
                ]
            }
        ],
        "bus": [
            {
                "key": {
                    "bus_id": 3
                },
                "snapshot": {
                    "bus_id": 3,
                    "fleet_code": "FLEET-101",
                    "capacity": 40
                },
                "via": [
                    "seat_pick.departure_id → departure.bus_id → bus"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("seat_pick_events").find({"eventType":"seat_pick_created"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "seat_pick_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "pick_id": 5
    }
  },
  {
    "_id": "event_000003",
    "eventType": "seat_pick_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "pick_id": 6
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("seat_pick_events").find({"source.key.pick_id":5}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "seat_pick_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "pick_id": 5
    }
  },
  {
    "_id": "event_000002",
    "eventType": "seat_pick_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "pick_id": 5
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("seat_pick_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "seat_pick_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "pick_id": 5
    }
  },
  {
    "_id": "event_000002",
    "eventType": "seat_pick_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "pick_id": 5
    }
  },
  {
    "_id": "event_000003",
    "eventType": "seat_pick_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "pick_id": 6
    }
  },
  {
    "_id": "event_000004",
    "eventType": "seat_pick_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "pick_id": 6
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("seat_pick_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| seat_pick_cancelled | 2 |
| seat_pick_created | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Kalu_Chinazo_301853302_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Kalu_Chinazo_301853302_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

