# Character Builder Dev Notes

This document describes how system definitions work in the Automata Character Builder. It explains the structure and intent of each major concept and how they're used in practice.

## `startingValues`

These define the default starting values for fields like attributes, skills, and funds. Each value includes:

* `from`: the source of the step scale (e.g. `'dieSteps'`)
* `value`: the default value (e.g. `'d4'`)

Example:

```ts
startingValues: {
  attributes: {
    strength: { from: 'dieSteps', value: 'd4' },
  },
  skills: {
    athletics: { from: 'dieSteps', value: 'd4' },
  },
  funds: 200,
}
```

## Projection Strategy

This system uses **projection, not mutation**. Rather than storing absolute values for things like attributes or skills, the system stores:

* a **starting value** (typically a die step like `'d4'`), and
* a **series of expenditures** or selections that affect it

The final value is computed dynamically by applying those effects to the starting point. This ensures that all character data remains derivable from the starting state plus user input, which is ideal for versioning, undo, and dynamic recalculation.

## `selectEffect` and `selectEffects`

These define how a field modifies the character when selected.

### `selectEffect` (singular)

Use when the effect is simple and always applies.

```ts
selectEffect: {
  targetField: 'attributes.agility',
  effectVerb: 'increase',
  effectType: 'step',
  effectVar: 'dieSteps',
  value: 1,
}
```

### `selectEffects` (plural)

Use when multiple effects may apply depending on context.

```ts
selectEffects: [
  {
    when: { key: { $eq: 'attributeBoost' } },
    apply: {
      targetField: 'attributes.${target}',
      effectVerb: 'increase',
      effectType: 'step',
      effectVar: 'dieSteps',
      value: 1,
      source: 'hindranceSpends'
    },
  },
  {
    when: { key: { $eq: 'startingFunds' } },
    apply: {
      targetField: 'funds',
      effectVerb: 'increase',
      effectType: 'value',
      value: 'startingValues.funds',
      source: 'hindranceSpends'
    },
  },
]
```

## Derived Fields

The `derived` section contains computed values. There are four types:

### `sumPoints`

Sums values using a point mapping:

```ts
{
  key: 'attributePointsSpent',
  type: 'sumPoints',
  source: 'attributes',
  mapping: { $var: 'dieCosts' },
}
```

### `sumFields`

Adds together values from other fields:

```ts
{
  key: 'totalPointsSpent',
  type: 'sumFields',
  fields: ['attributePointsSpent', 'skillPointsSpent']
}
```

### `sumCostMapping`

Uses a per-item cost mapping to sum values:

```ts
{
  key: 'skillPointsSpent',
  type: 'sumCostMapping',
  source: 'skills',
}
```

### `computed`

Evaluates a fixed expression:

```ts
{
  key: 'toughness',
  type: 'computed',
  value: {
    $add: [2, { $div: [{ $var: ['dieSides', { $field: 'attributes.vigor' }] }, 2] }],
  }
}
```

## `vars`

`vars` are reusable lookups and mappings shared across the system. They include:

* `dieSteps`, `dieSides`, `dieCosts`
* Lists like `hindranceList`, `skillList`, `edgeList`
* Cost and constraint mappings

These allow declarative configuration and cleaner references in fields.
