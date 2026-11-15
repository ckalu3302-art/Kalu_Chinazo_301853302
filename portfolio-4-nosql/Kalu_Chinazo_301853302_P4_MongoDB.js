// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("seat_pick_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("seat_pick_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "seat_pick_created",
                    "seat_pick_cancelled"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "seat_pick"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "pick_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("seat_pick_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "seat_pick_cancelled",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "event_id": "illustrative event_id",
                "schema_version": "illustrative schema_version",
                "actor_channel": "illustrative actor_channel"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "seat_pick_created",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "seat_pick",
            "key": {
                "pick_id": 6
            },
            "snapshot": {
                "pick_id": 6,
                "staff_id": 2,
                "departure_id": 4,
                "seat_no": 2,
                "picked_at": "2026-11-15T16:05:00Z"
            }
        },
        "embedded": {
            "staff": [
                {
                    "key": {
                        "staff_id": 2
                    },
                    "snapshot": {
                        "staff_id": 2,
                        "display_name": "Jordan Lee"
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "seat_pick_cancelled",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "seat_pick",
            "key": {
                "pick_id": 6
            },
            "snapshot": {
                "pick_id": 6,
                "staff_id": 2,
                "departure_id": 4,
                "seat_no": 2,
                "picked_at": "2026-11-15T16:05:00Z"
            }
        },
        "embedded": {
            "staff": [
                {
                    "key": {
                        "staff_id": 2
                    },
                    "snapshot": {
                        "staff_id": 2,
                        "display_name": "Jordan Lee"
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "event_id": "illustrative event_id",
                "schema_version": "illustrative schema_version",
                "actor_channel": "illustrative actor_channel"
            }
        }
    }
]));
  await db.getCollection("seat_pick_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("seat_pick_events").find({"eventType":"seat_pick_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("seat_pick_events").find({"source.key.pick_id":5}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("seat_pick_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("seat_pick_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("seat_pick_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("seat_pick_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("seat_pick_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
