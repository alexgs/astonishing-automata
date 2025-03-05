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
