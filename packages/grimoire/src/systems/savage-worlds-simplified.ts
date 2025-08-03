/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { Constraint } from '../types';

const attributeConstraints: Constraint[] = [
  {
    if: { this: { $in: [ 4, 6, 8, 10, 12 ] } },
    then: { allowed: true, reason: 'Must be a valid die value (d4–d12).' },
  },
];

export const savageWorldsSimplified = {
  id: 'savage-worlds-simplified',
  name: 'Savage Worlds (Simplified)',

  character: {
    attributes: {
      type: 'group',
      fields: {
        agility: {
          key: 'agility',
          type: 'number',
          required: true,
          constraints: attributeConstraints,
        },
        smarts: {
          key: 'smarts',
          type: 'number',
          required: true,
          constraints: attributeConstraints,
        },
        spirit: {
          key: 'spirit',
          type: 'number',
          required: true,
          constraints: attributeConstraints,
        },
        strength: {
          key: 'strength',
          type: 'number',
          required: true,
          constraints: attributeConstraints,
        },
        vigor: {
          key: 'vigor',
          type: 'number',
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

  steps: [
    {
      key: 'attributes',
      fields: [
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
