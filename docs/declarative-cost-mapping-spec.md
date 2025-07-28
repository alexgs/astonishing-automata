# Declarative Cost Mapping Schema & Expression DSL

This document defines a flexible and extensible schema pattern and expression language (DSL) for computing point-buy costs in RPG systems such as SWADE, GURPS, and beyond.

## ✨ Schema Pattern: `costMapping`

```ts
const defintion = {
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
}
```

- `compare` sets up two values to be compared.
- Each `mapping` defines:

  - a `Condition` on the comparison result
  - a `cost` expression to evaluate if matched

## 📊 Condition Operators

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

### Lookup and Variables

```ts
{ $var: "dieCosts" } // retrieves a map or value
{ $var: "dieCosts.strength" } // dotted path into nested vars
{ $var: "nestedTable.category.2" } // arrays supported by index
```

### Field and Option References

```ts
{ $field: "level" }              // value from inputSchema
{ $fromOption: "linkedAttribute" } // value from vars-defined item metadata
{ $path: "attributes.strength" } // absolute reference in character schema
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
      left: { $dieCost: { $field: "level" } },
      right: { $dieCost: { $fromOption: "linkedAttribute" } }
    },
    mapping: [
      {
        if: { $lte: true },
        cost: { $dieCost: { $field: "level" } }
      },
      {
        if: { $gt: true },
        cost: {
          $add: [
            { $dieCost: { $fromOption: "linkedAttribute" } },
            {
              $mul: [
                2,
                {
                  $sub: [
                    { $dieCost: { $field: "level" } },
                    { $dieCost: { $fromOption: "linkedAttribute" } }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

## 🛠️ Use Cases

- SWADE skill costs by linked attribute
- GURPS nonlinear cost tables (e.g. by category)
- Edge or feat scaling by tier or rank
- D\&D-style ability scores with racial modifiers

This schema pattern and expression DSL allows declarative cost computation across a wide range of RPG systems without embedding hardcoded logic in your interpreter.
