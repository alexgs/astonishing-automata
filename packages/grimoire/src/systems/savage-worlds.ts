/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { GameSystemDefinition } from '../types';

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
    dieSides: {
      d4: 4,
      d6: 6,
      d8: 8,
      d10: 10,
      d12: 12,
      "d12+1": 13,
      "d12+2": 14
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
    skillList: {
      academics: { label: "Academics", linkedAttribute: "smarts" },
      athletics: { label: "Athletics", linkedAttribute: "agility" },
      battle: { label: "Battle", linkedAttribute: "smarts" },
      boating: { label: "Boating", linkedAttribute: "agility" },
      commonKnowledge: { label: "Common Knowledge", linkedAttribute: "smarts" },
      driving: { label: "Driving", linkedAttribute: "agility" },
      electronics: { label: "Electronics", linkedAttribute: "smarts" },
      faith: { label: "Faith", linkedAttribute: "spirit" },
      fighting: { label: "Fighting", linkedAttribute: "agility" },
      focus: { label: "Focus", linkedAttribute: "spirit" },
      gambling: { label: "Gambling", linkedAttribute: "smarts" },
      healing: { label: "Healing", linkedAttribute: "smarts" },
      intimidation: { label: "Intimidation", linkedAttribute: "spirit" },
      language: { label: "Language", linkedAttribute: "smarts" },
      notice: { label: "Notice", linkedAttribute: "smarts" },
      occult: { label: "Occult", linkedAttribute: "smarts" },
      persuasion: { label: "Persuasion", linkedAttribute: "spirit" },
      performance: { label: "Performance", linkedAttribute: "spirit" },
      piloting: { label: "Piloting", linkedAttribute: "agility" },
      psionics: { label: "Psionics", linkedAttribute: "smarts" },
      repair: { label: "Repair", linkedAttribute: "smarts" },
      research: { label: "Research", linkedAttribute: "smarts" },
      riding: { label: "Riding", linkedAttribute: "agility" },
      science: { label: "Science", linkedAttribute: "smarts" },
      shooting: { label: "Shooting", linkedAttribute: "agility" },
      stealth: { label: "Stealth", linkedAttribute: "agility" },
      survival: { label: "Survival", linkedAttribute: "smarts" },
      taunt: { label: "Taunt", linkedAttribute: "smarts" },
      tech: { label: "Tech", linkedAttribute: "smarts" },
      thievery: { label: "Thievery", linkedAttribute: "agility" },
      weirdScience: { label: "Weird Science", linkedAttribute: "smarts" },
    },
  },

  startingValues: {
    attributes: {
      agility: { from: 'dieSteps', value: 'd4' },
      smarts: { from: 'dieSteps', value: 'd4' },
      spirit: { from: 'dieSteps', value: 'd4' },
      strength: { from: 'dieSteps', value: 'd4' },
      vigor: { from: 'dieSteps', value: 'd4' },
    },
    skills: {
      athletics: { from: 'dieSteps', value: 'd4' },
      commonKnowledge: { from: 'dieSteps', value: 'd4' },
      notice: { from: 'dieSteps', value: 'd4' },
      persuasion: { from: 'dieSteps', value: 'd4' },
      stealth: { from: 'dieSteps', value: 'd4' },
    },
    funds: 200,
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
          type: 'number',
          required: true,
          selectEffect: {
            targetField: 'attributes.agility',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
          },
          ui: {
            minSteps: 0,
            maxSteps: 5,
          },
        },
        smarts: {
          key: 'smarts',
          type: 'number',
          required: true,
          selectEffect: {
            targetField: 'attributes.smarts',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
          },
          ui: {
            minSteps: 0,
            maxSteps: 5,
          },
        },
        spirit: {
          key: 'spirit',
          type: 'number',
          required: true,
          selectEffect: {
            targetField: 'attributes.spirit',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
          },
          ui: {
            minSteps: 0,
            maxSteps: 5,
          },
        },
        strength: {
          key: 'strength',
          type: 'number',
          required: true,
          selectEffect: {
            targetField: 'attributes.strength',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
          },
          ui: {
            minSteps: 0,
            maxSteps: 5,
          },
        },
        vigor: {
          key: 'vigor',
          type: 'number',
          required: true,
          selectEffect: {
            targetField: 'attributes.vigor',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
          },
          ui: {
            minSteps: 0,
            maxSteps: 5,
          },
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
            targetField: 'attributes.${target}',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
            source: 'hindranceSpends'
          }
        },
        {
          when: { key: { $eq: 'edgeGain' } },
          apply: {
            targetField: 'edges',
            effectVerb: 'add',
            effectType: 'value',
            value: '${edge}',
            source: 'hindranceSpends',
          },
        },
        {
          when: { key: { $eq: 'skillBoost' } },
          apply: {
            targetField: 'skills.${target}',
            effectVerb: 'increase',
            effectType: 'step',
            effectVar: 'dieSteps',
            value: 1,
            source: 'hindranceSpends',
          },
        },
        {
          when: { key: { $eq: 'startingFunds' } },
          apply: {
            targetField: 'funds',
            effectVerb: 'increase',
            effectType: 'value',
            value: 'startingValues.funds',
            source: 'hindranceSpends',
          },
        },
      ],
    },

    edges: {
      key: 'edges',
      type: 'list',
      options: { $var: 'edgeList' },
      optionLabels: { $var: 'edgeList.label' },
      constraints: { $var: 'edgeList.requirements' }
    },

    skills: {
      key: 'skills',
      type: 'list',
      uniqueKeys: true,
      options: { $var: 'skillList' },
      optionLabels: { $var: 'skillList.label' },

      inputSchema: {
        level: {
          key: 'level',
          type: 'choice',
          options: { $var: 'dieSteps' },
        },
      },

      budget: {
        total: 12,
        spent: 'skillPointsSpent',
        message: 'You may spend up to 12 points on skills.'
      },

      costMapping: {
        compare: {
          left: { $var: [ "dieSides", { $field: "level" } ] },
          right: { $var: [ "dieSides", { $fromOption: "linkedAttribute" } ] }
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
    {
      key: 'skillPointsSpent',
      type: 'sumCostMapping',
      source: 'skills',
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
      key: 'skills',
      fields: [ 'skills' ],
    },
    {
      key: 'hindrances',
      fields: [ 'hindrances', 'hindranceSpends' ],
    },
  ],
};
