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
  version: '1.0.0',

  vars: {
    attributeKeys: ['agility', 'smarts', 'spirit', 'strength', 'vigor'],
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
    hindranceList: {
      allThumbs: { label: "All Thumbs", cost: 1 },
      anemic: { label: "Anemic", cost: 1 },
      arrogant: { label: "Arrogant", cost: 1 },
      badEyesMajor: { label: "Bad Eyes (Major)", cost: 2 },
      badEyesMinor: { label: "Bad Eyes (Minor)", cost: 1 },
      badLuck: { label: "Bad Luck", cost: 2 },
      bigMouth: { label: "Big Mouth", cost: 1 },
      blind: { label: "Blind", cost: 2 },
      bloodthirsty: { label: "Bloodthirsty", cost: 1 },
      cautious: { label: "Cautious", cost: 1 },
      clueless: { label: "Clueless", cost: 2 },
      codeOfHonor: { label: "Code of Honor", cost: 1 },
      curious: { label: "Curious", cost: 1 },
      deathWish: { label: "Death Wish", cost: 1 },
      delusionalMajor: { label: "Delusional (Major)", cost: 2 },
      delusionalMinor: { label: "Delusional (Minor)", cost: 1 },
      doubtingThomas: { label: "Doubting Thomas", cost: 1 },
      elderly: { label: "Elderly", cost: 2 },
      enemyMajor: { label: "Enemy (Major)", cost: 2 },
      enemyMinor: { label: "Enemy (Minor)", cost: 1 },
      greedyMajor: { label: "Greedy (Major)", cost: 2 },
      greedyMinor: { label: "Greedy (Minor)", cost: 1 },
      habitMajor: { label: "Habit (Major)", cost: 2 },
      habitMinor: { label: "Habit (Minor)", cost: 1 },
      hardOfHearingMajor: { label: "Hard of Hearing (Major)", cost: 2 },
      hardOfHearingMinor: { label: "Hard of Hearing (Minor)", cost: 1 },
      heroic: { label: "Heroic", cost: 1 },
      illiterate: { label: "Illiterate", cost: 1 },
      impulsive: { label: "Impulsive", cost: 1 },
      jealous: { label: "Jealous", cost: 1 },
      lame: { label: "Lame", cost: 2 },
      loyal: { label: "Loyal", cost: 1 },
      mean: { label: "Mean", cost: 1 },
      mute: { label: "Mute", cost: 2 },
      obese: { label: "Obese", cost: 1 },
      oneArm: { label: "One Arm", cost: 2 },
      oneEye: { label: "One Eye", cost: 2 },
      overconfident: { label: "Overconfident", cost: 1 },
      pacifistMajor: { label: "Pacifist (Major)", cost: 2 },
      pacifistMinor: { label: "Pacifist (Minor)", cost: 1 },
      phobiaMajor: { label: "Phobia (Major)", cost: 2 },
      phobiaMinor: { label: "Phobia (Minor)", cost: 1 },
      poverty: { label: "Poverty", cost: 2 },
      quirk: { label: "Quirk", cost: 1 },
      ruthlessMajor: { label: "Ruthless (Major)", cost: 2 },
      ruthlessMinor: { label: "Ruthless (Minor)", cost: 1 },
      slow: { label: "Slow", cost: 2 },
      small: { label: "Small", cost: 2 },
      stubborn: { label: "Stubborn", cost: 1 },
      suspicious: { label: "Suspicious", cost: 1 },
      thinSkinned: { label: "Thin Skinned", cost: 1 },
      ugly: { label: "Ugly", cost: 1 },
      vengefulMajor: { label: "Vengeful (Major)", cost: 2 },
      vengefulMinor: { label: "Vengeful (Minor)", cost: 1 },
      vowMajor: { label: "Vow (Major)", cost: 2 },
      vowMinor: { label: "Vow (Minor)", cost: 1 },
      wantedMajor: { label: "Wanted (Major)", cost: 2 },
      wantedMinor: { label: "Wanted (Minor)", cost: 1 },
      weakWilled: { label: "Weak Willed", cost: 1 },
      young: { label: "Young", cost: 2 },
    },
    hindranceSpends: {
      attributeBoost: { label: 'Increase Attribute', cost: 2 },
      edgeGain: { label: 'Gain Edge', cost: 2 },
      skillBoost: { label: 'Increase Skill', cost: 1 },
      startingFunds: { label: 'Starting Funds', cost: 1 },
    },
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
      key: 'hindrances',
      type: 'list',
      options: { $var: 'hindranceList' },
      optionLabels: { $var: 'hindranceList.label' },
      budget: {
        total: 4,
        spent: 'hindrancePointsTaken',
        message: 'You may take up to 4 points of hindrances.',
      },
    },

    hindranceSpends: {
      key: 'hindranceSpends',
      type: 'list',
      uniqueKeys: false, // Allow multiple of the same spend
      options: { $var: 'hindranceSpends' },
      optionLabels: { $var: 'hindranceSpends.label' },
      budget: {
        total: { $var: 'hindrancePointsTaken' },
        spent: 'hindrancePointsSpent',
      },
      variants: {
        attributeBoost: {
          label: 'Increase Attribute',
          schema: {
            target: {
              key: 'target',
              type: 'choice',
              options: { $var: 'attributeKeys' },
              required: true,
            },
          },
        },
        edgeGain: {
          label: 'Gain Edge',
          schema: {
            edge: {
              key: 'edge',
              type: 'choice',
              options: { $var: 'edgesList' },
              required: true,
            },
          },
        },
        skillBoost: {
          label: 'Increase Skill',
          schema: {
            target: {
              key: 'target',
              type: 'choice',
              options: { $var: 'skillKeys' },
              required: true,
            },
          },
        },
        startingFunds: {
          label: 'Starting Funds',
          schema: {},
        },
      },
      selectEffects: [
        {
          when: { key: { $eq: 'attributeBoost' } },
          apply: {
            target: 'attributes.${target}',
            value: 'step+1',
            source: 'hindranceSpends'
          }
        },
        {
          when: { key: { $eq: 'edgeGain' } },
          apply: {
            target: 'edges.startingEdge',
            value: '${edge}',
            source: 'hindranceSpends',
          },
        },
        {
          when: { key: { $eq: 'skillBoost' } },
          apply: {
            target: 'skills.${target}',
            value: 'points+1',
            source: 'hindranceSpends',
          },
        },
        {
          when: { key: { $eq: 'startingFunds' } },
          apply: {
            target: 'funds',
            value: '+(startingFunds*2)',
            source: 'hindranceSpends',
          },
        },
      ],
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

    skills: {
      key: 'skills',
      type: 'list',
      uniqueKeys: true,
      options: { $var: 'skillList' }, // TODO Creat this var (inc. `label` & `linkedAttribute`)
      optionLabels: { $var: 'skillList.label' },

      inputSchema: {
        level: 'string' // TODO Make this a "choice" field to select die type
      },

      budget: {
        total: 12,
        spent: 'skillPointsSpent', // TODO Define derived field
        message: 'You may spend up to 12 points on skills.'
      },

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
    }
  },

  derived: [
    {
      key: 'attributePointsSpent',
      type: 'sumPoints',
      source: 'attributes',
      mapping: { $var: 'dieCosts' },
    },
    {
      key: 'hindrancePointsTaken',
      type: 'sumPoints',
      source: 'hindrances',
      mapping: { $var: 'hindranceList.cost' },
    },
    {
      key: 'hindrancePointsSpent',
      type: 'sumPoints',
      source: 'hindranceSpends',
      mapping: { $var: 'hindranceSpends.cost' },
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
