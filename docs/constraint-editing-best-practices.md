# Constraint-Based Editing Best Practices

## Overview

In the constraint-based architecture, character editing is driven by a declarative system definition and validated by a shared constraint engine. Instead of enforcing a fixed step-by-step flow via a state machine, the system models each editable field as a standalone input governed by contextual constraints. The front-end is responsible for collecting and displaying user input, while the back-end enforces rules and confirms changes through CQRS-style commands and events.

This approach enables nonlinear editing, dynamic validation, and support for multiple game systems without hardcoding logic into front-end components or back-end handlers.

## Architecture Principles

- **Schema-driven UI:** Each game system provides a structured definition of its fields, steps, and validation constraints. The front-end interprets this schema to render the appropriate interface.
- **Constraint-based validation:** Rules about which values are valid, visible, or allowed are encoded as declarative constraints. These are evaluated by a shared constraint service used on both front-end and back-end.
- **Optimistic editing:** User interactions are first stored in local front-end state. When the user changes screens or leaves the wizard, the modified data is submitted to the back-end.
- **CQRS confirmation:** All updates flow through the command handler layer. Commands are validated against the shared constraint engine and converted to events. Events are committed to the event store and used to update the read model.
- **Step transitions trigger sync:** The front-end syncs local edits with the back-end at defined points (e.g. on screen transitions or save actions), rather than on every keystroke.
- **No front-end state machine:** The UI does not use an FSM to track wizard steps. Instead, navigation is flexible and guided by schema dependencies or validation completeness.

## System Definition Format

Each game system is represented as a JSON-compatible schema:

```ts
type GameSystemDefinition = {
  id: string;
  name: string;
  steps: StepDefinition[];
};

type StepDefinition = {
  key: string;
  fields: FieldDefinition[];
  dependsOn?: string[];
};

type FieldDefinition = {
  key: string;
  type: 'string' | 'number' | 'choice' | 'boolean';
  required?: boolean;
  options?: string[];
  constraints?: Constraint[];
};
```

This format is interpreted by the front-end and enforced by the back-end.

## Constraint Evaluation

Constraints are evaluated using a shared engine that supports MongoDB-style operators:

```ts
type Constraint = {
  if: { [field: string]: { $eq?: any; $lt?: any; $in?: any; ... } };
  then: { allowed: boolean; reason?: string };
};
```

Example:

```json
{
  "if": { "class": { "$eq": "Wizard" }, "armor": { "$eq": "Heavy" } },
  "then": { "allowed": false, "reason": "Wizards cannot wear heavy armor." }
}
```

## Front-End Integration

- A mock `constraintService` is used during early development to simulate validation behavior.
- The UI calls `evaluateAll(state)` or `evaluateField(key, state)` to determine constraint status.
- Fields can be hidden, disabled, or marked invalid based on evaluation results.
- The front-end submits a `PatchCharacterCommand` when navigating between steps or returning to the viewer.

## Back-End Responsibilities

- Validate all incoming commands using the shared constraint engine.
- Emit events such as `CharacterUpdated` or `FieldPatched`.
- Apply events to generate the updated read model.
- Do not assume any step order; enforce only valid values.

## Summary

This architecture supports flexible, schema-driven character editing without overengineering the front-end or duplicating logic across systems. Constraints are the single source of truth, and all enforcement is centralized. Event sourcing and CQRS ensure auditability and consistent state transitions, while allowing the front-end to remain responsive and local-first.
