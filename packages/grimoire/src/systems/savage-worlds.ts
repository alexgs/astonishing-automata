/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { Constraint, GameSystemDefinition } from '../types';

const attributeConstraints: Constraint[] = [
  {
    if: { this: { $in: { $var: 'dieSteps' } } },
    then: { allowed: true, reason: 'Must be a valid die value (d4–d12).' },
  },
];

export const savageWorlds: GameSystemDefinition = {
  id: 'savage-worlds',
  name: 'Savage Worlds (SWADE)',

  vars: {
    dieCosts: {
      d4: 0,
      d6: 1,
      d8: 2,
      d10: 3,
      d12: 4,
      "d12+1": 5,
      "d12+2": 6
    },
    dieCostLabel: {
      d4: "d4 (0)",
      d6: "d6 (1)",
      d8: "d8 (2)",
      d10: "d10 (3)",
      d12: "d12 (4)"
    },
    dieSteps: ['d4', 'd6', 'd8', 'd10', 'd12', 'd12+1', 'd12+2'],
  },

  character: {
    attributes: {
      type: 'group',
      fields: {
        attributeBudget: {
          key: 'attributeBudget',
          type: 'budget',
          label: 'Attribute Points',
          total: 5,
          spent: 'attributePointsSpent',
          message: 'You may only spend 5 points across all attributes.',
        },
        agility: {
          key: 'agility',
          type: 'choice',
          options: { $var: 'dieSteps' },
          optionLabels: { $var: 'dieCostLabel' },
          required: true,
          constraints: attributeConstraints,
        },
        smarts: {
          key: 'smarts',
          type: 'choice',
          options: { $var: 'dieSteps' },
          optionLabels: { $var: 'dieCostLabel' },
          required: true,
          constraints: attributeConstraints,
        },
        spirit: {
          key: 'spirit',
          type: 'choice',
          options: { $var: 'dieSteps' },
          optionLabels: { $var: 'dieCostLabel' },
          required: true,
          constraints: attributeConstraints,
        },
        strength: {
          key: 'strength',
          type: 'choice',
          options: { $var: 'dieSteps' },
          optionLabels: { $var: 'dieCostLabel' },
          required: true,
          constraints: attributeConstraints,
        },
        vigor: {
          key: 'vigor',
          type: 'choice',
          options: { $var: 'dieSteps' },
          optionLabels: { $var: 'dieCostLabel' },
          required: true,
          constraints: attributeConstraints,
        },
      },
    },

    hindrances: {
      type: 'group',
      fields: {
        majorHindrance: {
          key: 'majorHindrance',
          type: 'choice',
          required: true,
          options: [ 'Clueless', 'Bad Eyes', 'Habit', 'Lame' ],
        },
        minorHindrances: {
          key: 'minorHindrances',
          type: 'multichoice',
          options: [ 'All Thumbs', 'Mean', 'Quirk', 'Ugly' ],
          constraints: [
            {
              if: { this: { $count: { $lte: 2 } } },
              then: {
                allowed: true,
                reason: 'You can select up to 2 minor hindrances.',
              },
            }
          ],
        },
      },
    },

    edges: {
      type: 'group',
      fields: {
        startingEdge: {
          key: 'startingEdge',
          type: 'choice',
          options: [ 'Alertness', 'Ambidextrous', 'Brawny', 'Charismatic' ],
          constraints: [
            {
              if: {
                'attributes.strength': { $lt: 8 },
                this: { $eq: 'Brawny' },
              },
              then: {
                allowed: false,
                reason: 'Brawny requires Strength d8 or higher.',
              },
            },
          ],
        },
      },
    },
  },

  derived: [
    {
      key: 'attributePointsSpent',
      type: 'sumPoints',
      source: 'attributes',
      mapping: { $var: 'dieCosts' },
    },
  ],

  steps: [
    {
      key: 'attributes',
      fields: [
        'attributes.attributeBudget',
        'attributes.agility',
        'attributes.smarts',
        'attributes.spirit',
        'attributes.strength',
        'attributes.vigor',
      ],
    },
    {
      key: 'hindrances',
      fields: [ 'hindrances.majorHindrance', 'hindrances.minorHindrances' ],
    },
    {
      key: 'edges',
      fields: [ 'edges.startingEdge' ],
    },
  ],
};
