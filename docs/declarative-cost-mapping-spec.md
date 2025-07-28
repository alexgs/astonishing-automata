# Declarative Cost Mapping Schema & Expression DSL

This document defines a flexible and extensible schema pattern and expression language (DSL) for computing point-buy costs in RPG systems such as SWADE, GURPS, and beyond.

## ✨ Schema Pattern: `costMapping`

```ts
const definition = {
  costMapping: {
    compare: {
      left: Expression,
      right: Expression
    },
    mapping: [
      {
        if: Condition,
        cost: Expression
      }
      // More mappings...
    ]
  }
};
```

- `compare` sets up two values to be compared.
- Each `mapping` defines:

  - a `Condition` on the comparison result
  - a `cost` expression to evaluate if matched

## 📐 Condition Operators

- `$eq`: equality
- `$lt`, `$lte`, `$gt`, `$gte`: numeric comparisons
- `$in`, `$nin`: membership
- `$always`: unconditional match

```ts
{ $eq: true }
{ $lte: true }
{ $always: true }
```

## 🧾 Expression DSL

Expressions define how cost is calculated. They can be nested.

### Scalars and Basic Math

```ts
{ $add: [a, b] }
{ $sub: [a, b] }
{ $mul: [a, b] }
{ $div: [a, b] }
```

### Variables and Lookups

```ts
{ $var: "dieCosts.strength" }                     // dotted path
{ $var: ["dieCosts", "strength"] }                // equivalent array form
{ $var: "nestedTable.category.2" }                // dotted path with array index
{ $var: ["nestedTable", "category", 2] }          // equivalent array form
{ $var: ["dieCosts", { $field: "level" }] }       // dynamic key from user input
{ $var: ["dieCosts", { $fromOption: "linkedAttribute" }] } // from list item metadata
```

### Field and Option References

```ts
{ $field: "level" }                // value from inputSchema
{ $fromOption: "linkedAttribute" } // value from vars-defined item metadata
{ $path: "attributes.strength" }   // absolute reference in character schema
```

## ♻ Evaluation Order

1. Evaluate `compare.left` and `compare.right`
2. Compute the comparison result
3. Iterate through `mapping` entries
  - Use the first `if` that matches the result
  - Evaluate its `cost` expression

4. Return the computed cost

## ✅ Example Use Case: SWADE Skill Costs

```ts
const definition = {
  costMapping: {
    compare: {
      left: { $var: [ "dieCosts", { $field: "level" } ] },
      right: { $var: [ "dieCosts", { $fromOption: "linkedAttribute" } ] }
    },
    mapping: [
      {
        if: { $lte: true },
        cost: { $var: [ "dieCosts", { $field: "level" } ] }
      },
      {
        if: { $gt: true },
        cost: {
          $add: [
            { $var: [ "dieCosts", { $fromOption: "linkedAttribute" } ] },
            {
              $mul: [
                2,
                {
                  $sub: [
                    { $var: [ "dieCosts", { $field: "level" } ] },
                    { $var: [ "dieCosts", { $fromOption: "linkedAttribute" } ] }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
};
```

## 🛠️ Use Cases

- SWADE skill costs by linked attribute
- GURPS nonlinear cost tables (e.g. by category)
- Edge or feat scaling by tier or rank
- D\&D-style ability scores with racial modifiers

This schema pattern and expression DSL allows declarative cost computation across a wide range of RPG systems without embedding hardcoded logic in your interpreter.
