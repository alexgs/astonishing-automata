# Working with XState

[XState][1] is a library for creating, interpreting, and executing finite state machines. Like many powerful libraries, it had its quirks. This document aims to map XState's quirks to our own quirks and provide a guide for working with XState in our codebase.

[1]: https://stately.ai/docs/xstate

## Naming things

When working with actors and state machines, XState uses the term "value" to refer to the name of the current state of the machine. We call it "step." XState uses the term "context" to refer to data that is passed between states without being the actual state of the state machine. We call it "data."

| XState  | Our terms |
|---------|-----------|
| value   | step      |
| context | data      |

## Persistence

Our system is an event sourcing system that uses a state machine, not a state machine that uses event sourcing. This means that we don't need to persist the state of the state machine itself. Instead, we persist the events that the state machine processes. In particular, we use the persistence pattern in the section "[Persisting state machine values][2]" in the [XState persistence documentation][3].

[2]: https://stately.ai/docs/persistence#persisting-state-machine-values
[3]: https://stately.ai/docs/persistence
