# Constraint-Based Editing Architecture: Proof of Concept Recap

This document summarizes the motivations, implementation, and validation of the architectural pivot from finite state machine (FSM)-driven workflows to a constraint-based editing model for the Automata Character Builder.

## Why We Pivoted

The original design used XState-based finite state machines on both the client and server to model and enforce step transitions in the character creation process. This approach proved overly rigid and difficult to generalize, especially given the following goals:

* Support game systems where character creation steps may be completed in any order (e.g. D\&D Beyond-style editing)
* Expand support to multiple game systems with very different character structures
* Allow the UI to remain usable even when the character is in an invalid state (e.g. mid-edit or overweight mech)

We observed that the value of state machines was not in modeling steps or transitions, but in modeling **constraints** — which can be better expressed declaratively and evaluated independently of step order or navigation.

## Goals of the New Architecture

We defined three core goals for the new system:

1. **Can we render a UI dynamically from a schema?**
2. **Can we apply constraints to that UI at runtime?**
3. **Does this model feel better than a state-machine-driven approach?**

## Proof of Concept Implementation

To test the new architecture, we:

* Defined a simplified Savage Worlds schema in TypeScript, including character fields and validation constraints
* Built a generic field renderer in Svelte that uses schema-defined types
* Implemented a basic constraint evaluation engine that supports `$eq`, `$lt`, `$in`, and `$count.$lte`
* Wired up real-time validation of user input against field-level constraints

## Key Outcomes

All three goals were met:

### Dynamic UI Rendering

* Steps and fields are fully defined by data
* No hardcoded logic required to render the character form

### Runtime Constraint Evaluation

* Constraints are evaluated live as the user interacts with fields
* Violations are displayed inline
* Reusable rules and path resolution (`this` keyword) proved effective

### Flexible, Generalizable Model

* Constraints are simpler and more reusable than FSM transitions
* Supports editing out of order, invalid intermediary states
* Much easier to imagine scaling across multiple game systems

## Bonus Insights

* The architecture encourages strong separation of policy (schema + rules) from implementation (UI rendering, saving, etc.)
* Constraint validation can eventually power both client-side validation and server-side enforcement
* This structure aligns well with long-term goals like mech designer tools and multi-system support

## Next Steps

* Expand the constraint language (e.g. add `$gte`, `$neq`, `$not`, `$and`)
* Implement conditional visibility for fields and steps
* Design the file format for user-defined system schemas (e.g. JSON or DSL)
* Explore constraint evaluation tooling: validation summaries, visual debuggers, etc.

This architectural pivot significantly increases the flexibility, clarity, and scalability of the character builder. We consider this proof of concept successful and will proceed with implementation based on this model.
