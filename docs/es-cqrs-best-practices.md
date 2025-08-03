# ES/CQRS Best Practices

##  Designing good commands and events

- Commands and events are both idempotent.
- Commands need only enough data to calculate the new state from the old state.
- Events store both previous state and new state, but only the fields that have changed. This allows state to be rebuilt incrementally without needing full snapshots.
- Commands and events are fully serializable.
- Events avoid tracking deletions (`null` values) unless explicitly required.

## System architecture

- The controller layer validates inputs and passes them to the service layer.
- The service layer bundles the inputs into a command object and puts it on the command bus.
- The command handler executes business logic.
  - If the command is invalid, it rejects the request.
  - If the command is valid, it generates an event and gives it to the event store to save.
- The event store saves the event to the database.
  - The event store is append-only, ensuring events are never modified.
  - The event store is queryable for auditing and reconstructing state.
- The database durably stores the event and notifies the event publisher of the new event.
- The event publisher puts the event on the event bus to be consumed by event listeners.

## Handling Derived Modifiers in Event-Sourced Systems

### Context

In TTRPG systems like Savage Worlds or D&D, user actions (e.g. spending Hindrance points or selecting an ancestry) often have downstream effects such as:

- Granting a bonus Edge
- Increasing an attribute die
- Adding proficiencies or modifiers

These effects must be captured **without hardcoding system-specific knowledge** into the front-end, while remaining **replayable and debuggable** in an event-sourced architecture.

### The Problem

If we emit only high-level events like:

```ts
const event ={
  type: "UpdateCharacterSelection",
  payload: {
    field: "hindranceSpends",
    value: [{ type: "attribute", value: "strength" }],
  },
};
```

…then we need a way to project the downstream effect (`step+1 to strength`) while keeping the projection deterministic and up-to-date with the latest game logic.

### Design Tradeoffs

| Approach                         | Description                                             | Pros                                        | Cons                                                 |
|----------------------------------|---------------------------------------------------------|---------------------------------------------|------------------------------------------------------|
| **Effects baked into events**    | Emit the actual modifier (`step+1`) inside the event    | Easy to debug and project                   | Cannot evolve logic; requires rewriting history      |
| **Schema-driven projection**     | Projection uses schema to derive modifiers at runtime   | Logic can evolve; events remain clean       | Harder to trace behavior at time of event            |
| **Input-only events + schema** ✅ | Events store only the user intent; schema interprets it | Reprojectable, future-proof, minimal events | Requires schema lookup during projection             |
| **Schema versioning** ✅          | Events record which version of the schema they used     | Accurate replays + flexibility              | Slightly more complex infra (versioning, migrations) |

### Recommended Pattern

Use a **minimal intent-based event**:

```ts
const event = {
  type: "UpdateCharacterSelection",
  payload: {
    schemaId: "savage-worlds",
    schemaVersion: "v1",
    field: "hindranceSpends",
    value: [{ type: "attribute", value: "strength" }],
  },
};
```

Then, in the projection layer:

1. Load the schema version referenced in the event
2. Look up `spendEffects` for the field and value
3. Apply the declared modifier(s) to the appropriate target
4. Materialize modifiers into the read-model

Example projected state:
```ts
const state = {
  attributes: {
    strength: {
      base: "d6",
      final: "d8",
      modifiers: [
        {
          value: "step+1",
          source: "hindrances",
          reason: "Bonus from Hindrance points"
        },
      ],
    },
  },
};
```

### Benefits

- ✅ Keeps front-end schema-agnostic
- ✅ Supports game logic defined declaratively in schema
- ✅ Enables replay, undo, and future rule changes
- ✅ Clean audit trail (intent, not output)

### Optional Enhancements

- Define `resolveSpendEffects(schema, field, value)` helper to compute modifiers
- Cache derived modifiers in the read-model for performance
- Allow per-event schema versioning to preserve historical logic

### Summary

- Emit **intent**, interpret using **schema**, and project **effects**.
- Keep the schema declarative, the events clean, and the projections replayable.
