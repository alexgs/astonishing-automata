# Bruenor

Bruenor is a SvelteKit front-end for _Automata Character Builder_.

## Typography

For some reading on typographic scales, see [this article][1]. To calculate scale, use [this tool][2].

[1]: https://designcode.io/typographic-scales
[2]: https://typescale.com/

## Exit Criteria for `chenowyn` Becoming the Primary App

Here’s a checklist of things to complete before you officially make that call:

### Core Editor Features

- [ ] Dynamically render UI from any game system definition
- [ ] Evaluate and display constraint violations per field
- [ ] Navigate between steps in any order
- [ ] Conditional field/step visibility (optional for MVP)
- [ ] Mark full character sheet as valid/invalid (overall validation pass)

## Character Lifecycle

- [ ] Load a character from the back-end
- [ ] Update a character in local state
- [ ] Save valid character state to the server
- [ ] Handle and display constraint violations returned from the back-end

### Mock Integration

- [ ] Plug in mock `constraintService` and mock `characterService`
- [ ] Confirm behavior is correct when constraints are only partially enforced

### Front-End Polish

- [ ] Port theme/colors/styles from `bruenor`
- [ ] Port Clerk auth from `bruenor`
- [ ] Add top-level route for “view all characters” or a dashboard
