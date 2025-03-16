# Automata Character Builder

A modular and extensible TTRPG character builder.

## License
This software is licensed under the **Elastic License 2.0 (ELv2)**.

- **Individuals and non-profits** may self-host and modify it freely.
- **You may _NOT_ offer this software as a managed service (SaaS).**
- The original author retains the right to run and monetize a SaaS version.
- For **commercial SaaS usage**, a separate commercial license is available.

For more details, see the full [Elastic License 2.0](LICENSE.md). For commercial licensing inquiries, contact [license@automatacodex.com][2].

[2]: mailto:license@automatacodex.com

## Overview

The Automata Character Builder is a web-based character creation tool designed to support D&D 5e (2014) with plans for future expansion into a customizable and generic TTRPG character builder. It follows a state machine-based approach to guide players through the character creation and leveling-up process while maintaining flexibility.

The project is built using a monorepo structure with `npm workspaces` and consists of the following key technologies:

- **Backend:** NestJS with CQRS (Command Query Responsibility Segregation)
- **Frontend:** SvelteKit for an interactive UI
- **Database:** PostgreSQL with Flyway for schema migrations
- **State Management:** XState for defining character creation states
- **Rendering Engine (Future):** Phaser or PixiJS for visual elements

## Naming convention

Apps in this project are named for [prominent characters][1] from the _Forgotten Realms_ setting.

[1]: https://forgottenrealms.fandom.com/wiki/Heroes%27_Lorebook#Characters

## Core Features

- **State Machine-Driven Character Creation**
  - Guided process ensuring valid choices
  - Clear separation of steps (e.g., selecting species, class, background, abilities)
- **Leveling System**
  - Modular approach to handling class progression
  - Integration with CQRS to track changes over time
- **Future Features**
  - Expandability for other TTRPGs
  - API for external integrations (e.g., VTT import)
  - Visual rendering of character sheets
  - Custom rule support, such as
    - `Ancestries & Cultures` supplements for species and cultural separation
    - `Advanced Spell Point System` for spellcasting

### State Machine-Driven Workflow

The Automata Character Builder uses a state machine architecture (powered by XState) to manage the complex workflow of character creation and leveling. Each step&mdash;such as selecting a species, choosing a class, and assigning ability scores&mdash;is represented as a distinct state with defined transitions. This approach ensures that choices are validated in real-time, prevents invalid selections, and allows for non-linear progression where appropriate. By structuring character creation as a stateful process, we maintain flexibility for different RPG systems while enforcing the logical flow required for a structured build process.

## Project Structure

```
/automata-character-builder
├── apps/
│   ├── alustriel/      # NestJS API
│   ├── bruenor/        # SvelteKit UI
├── database/           # Configuration and stuff for PostrgeSQL
├── docs/               # Project documentation
├── flyway/             # Database schema migrations
├── README.md
```

## Design Considerations

- **CQRS & Event Sourcing:** Allows tracking of character history and potential undo functionality.
- **Modularity:** Each piece of functionality (e.g., character states, class progression) is isolated for maintainability.
- **Extensibility:** Designed to support other RPG systems beyond D&D 5e.
