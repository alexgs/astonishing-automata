# Automata Character Builder

A modular and extensible TTRPG character builder built for system flexibility, nonlinear workflows, and deep validation.

## License

This software is licensed under the **Elastic License 2.0 (ELv2)**.

- **Individuals and non-profits** may self-host and modify it freely.
- **You may _NOT_ offer this software as a managed service (SaaS).**
- The original author retains the right to run and monetize a SaaS version.
- For **commercial SaaS usage**, a separate commercial license is available.

For more details, see the full [Elastic License 2.0](LICENSE.md). For commercial licensing inquiries, contact [license@automatacodex.com][2].

[2]: mailto:license@automatacodex.com

## Overview

Automata Character Builder is a schema-driven character creation platform, currently focused on support for Savage Worlds Adventure Edition (SWADE), with future plans for additional game systems. It uses a **constraint-based editing model** instead of a rigid step-by-step flow, enabling both flexibility and strong validation.

### Key Technologies

- **Frontend:** SvelteKit (UI)
- **Backend:** NestJS with CQRS and Event Sourcing
- **Validation:** Shared constraint engine used on both front-end and back-end
- **Database:** PostgreSQL (with Flyway for migrations)
- **Monorepo:** Managed with `npm workspaces`

## Design Highlights

- **Schema-Driven UI**
  The system definition specifies editable fields, their types, and validation constraints. This enables UI rendering and validation to be dynamic and consistent across systems.

- **Constraint-Based Editing**
  Each field is governed by declarative constraints (e.g., "Wizards cannot wear heavy armor"), which are evaluated in real time. This eliminates the need for hardcoded rule logic.

- **CQRS + Event Sourcing**
  All edits flow through command handlers, which validate via the shared constraint engine. Events are recorded and used to rebuild state, ensuring full auditability.

- **Nonlinear Workflow**
  Character editing does not follow a strict FSM. Users can navigate freely between steps, and validation is context-sensitive rather than step-dependent.

## Core Features

- **Constraint Evaluation**
  All rules about valid, visible, or allowed values are encoded as constraints evaluated using MongoDB-style syntax.

- **Local-First with Backend Sync**
  The UI uses optimistic updates and submits changes at defined sync points (e.g., on screen transitions or save).

- **System Extensibility**
  New game systems can be added by authoring a system definition schema. No need to rewrite UI or core logic.

- **Event Auditability**
  Every change to a character is captured as an event, allowing for robust history tracking and potential undo/redo workflows.

## Project Structure

```
/automata-character-builder
├── apps/
│   ├── alustriel/      # NestJS API
│   ├── bruenor/        # SvelteKit UI
├── database/           # PostgreSQL config and helpers
├── docs/               # Developer documentation
├── flyway/             # Schema migrations
├── README.md
```

## Naming Convention

Applications are named after [Forgotten Realms characters][1], following an internal theme.

[1]: https://forgottenrealms.fandom.com/wiki/Heroes%27_Lorebook#Characters

## Future Directions

- Additional game systems (Fate, D&D 5e, custom systems)
- Visual character sheet rendering
- VTT integration and API exposure
- Support for supplements (e.g., *Ancestries & Cultures*, *Advanced Spell Points*)

## Summary

Automata is built to provide a flexible, deeply validated character editing experience that can scale across multiple TTRPG systems. Its use of constraint-driven validation, CQRS, and shared schemas makes it highly adaptable and maintainable for both developers and system designers.
