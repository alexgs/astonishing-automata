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
    edgeList: {
      // Background Edges
      alertness: {
        label: "Alertness",
        description: "+2 to Notice rolls.",
        requirements: {}
      },
      ambidextrous: {
        label: "Ambidextrous",
        description: "No off-hand penalty.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },
      arcaneBackground: {
        label: "Arcane Background",
        description: "Gain access to a specific type of magic or psionics.",
        requirements: {}
      },
      arcaneResistance: {
        label: "Arcane Resistance",
        description: "+2 to resist arcane abilities, and -2 to damage from arcane abilities.",
        requirements: {
          attributes: {
            spirit: { $gte: 'd8' }
          },
        },
      },
      aristocrat: {
        label: "Aristocrat",
        description: "This character walks in the elite social circles of the setting.",
        requirements: {},
      },
      attractive: {
        label: "Attractive",
        description: "+1 Persuasion and Performance rolls.",
        requirements: {}
      },
      berserk: {
        label: "Berserk",
        description: "Berserkers become wild and nearly uncontrollable when the \"red rage\" takes them, but they are deadly killing machines as well!",
        requirements: {},
      },
      brave: {
        label: "Brave",
        description: "+2 to Fear checks.",
        requirements: {}
      },
      brawny: {
        label: "Brawny",
        description: "+1 Toughness and doubled load limit.",
        requirements: {
          attributes: {
            strength: { $gte: 'd8' }
          }
        }
      },
      brute: {
        label: "Brute",
        description: "Brutes focus on core strength and fitness over coordination and flexibility.",
        requirements: {
          attributes: {
            strength: { $gte: 'd8' },
            vigor: { $gte: 'd8' },
          }
        }
      },
      charismatic: {
        label: "Charismatic",
        description: "One free reroll on Persuasion rolls.",
        requirements: {
          attributes: {
            spirit: { $gte: 'd8' }
          }
        }
      },
      elan: {
        label: "Elan",
        description: "+2 bonus when spending a Benny on a Trait roll.",
        requirements: {
          attributes: {
            spirit: { $gte: 'd8' }
          }
        }
      },
      fame: {
        label: "Fame",
        description: "This character is well-known, for better or worse.",
        requirements: {}
      },
      fastHealer: {
        label: "Fast Healer",
        description: "+2 to natural healing rolls.",
        requirements: {
          attributes: {
            vigor: { $gte: 'd8' }
          }
        }
      },
      fleetFooted: {
        label: "Fleet-Footed",
        description: "+2 Pace and d10 running die.",
        requirements: {
          attributes: {
            agility: { $gte: 'd6'
            }
          }
        }
      },
      improvedArcaneResistance: {
        label: "Improved Arcane Resistance",
        description: "As Arcane Resistance, but the penalty to the arcane skill roll and damage are increased to 4.",
        requirements: {
          attributes: {
            edges: {
              arcaneResistance: true
            },
          },
        },
      },
      linguist: {
        label: "Linguist",
        description: "This world-traveler has an ear for languages.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd6' }
          }
        }
      },
      luck: {
        label: "Luck",
        description: "Gain one extra Benny per session.",
        requirements: {}
      },
      quick: {
        label: "Quick",
        description: "Redraw Action Card of 5 or lower.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },
      rich: {
        label: "Rich",
        description: "Start with more money and better lifestyle.",
        requirements: {}
      },
      veryRich: {
        label: "Very Rich",
        description: "Start with even more money and lavish lifestyle.",
        requirements: {
          edges: {
            rich: true
          },
        }
      },

      // Combat edges
      brawler: {
        label: "Brawler",
        description: "+1 die type to Strength for damage with bare-handed attacks; +1 Toughness.",
        requirements: {
          attributes: {
            strength: { $gte: 'd8' },
            vigor: { $gte: 'd8' },
          },
        },
      },
      calculating: {
        label: "Calculating",
        description: "When his Action Card is a Five or less, he ignores up to 2 points of penalties on one action that turn, which can include Multi-Action, cover, Range, and even Wound penalties.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd8' }
          }
        }
      },
      deadShot: {
        label: "Dead Shot",
        description: "Double damage on a successful attack with a Raise using a ranged weapon when spending a Benny.",
        requirements: {
          skills: {
            $or: {
              athletics: { $gte: 'd8' },
              shooting: { $gte: 'd8' }
            },
          }
        }
      },
      extraction: {
        label: "Extraction",
        description: "When a character withdraws from melee, one foe doesn't get a free attack.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },
      feint: {
        label: "Feint",
        description: "When performing a Test with the Fighting skill, you can choose to make the foe resist with Smarts instead of Agility.",
        requirements: {
          skills: {
            fighting: { $gte: 'd8' }
          }
        }
      },
      firstStrike: {
        label: "First Strike",
        description: "One free Fighting attack per turn when foe moves adjacent.",
        requirements: {
          skills: {
            fighting: { $gte: 'd8' }
          }
        }
      },
      freeRunner: {
        label: "Free Runner",
        description: "The character moves at her full Pace on Difficult Ground when on foot. She also adds +2 to her Athletics rolls when climbing and in foot Chases.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          },
          skills: {
            athletics: { $gte: 'd6' }
          }
        }
      },
      hardToKill: {
        label: "Hard to Kill",
        description: "This adventurer may ignore his Wound penalties when making Vigor rolls to avoid Bleeding Out.",
        requirements: {
          attributes: {
            spirit: { $gte: 'd8' }
          }
        },
      },
      ironJaw: {
        label: "Iron Jaw",
        description: "The character adds +2 to Soak rolls and Vigor rolls to avoid Knockout Blows.",
        requirements: {
          attributes: {
            vigor: { $gte: 'd8' }
          },
        },
      },
      martialArtist: {
        label: "Martial Artist",
        description: "Fighting attacks are Str+d4; +1 Parry.",
        requirements: {
          skills: {
            fighting: { $gte: 'd6' }
          }
        }
      },
      mightyBlow: {
        label: "Mighty Blow",
        description: "If your Action Card is a Joker, double the damage of your first successful Fighting attack this round.",
        requirements: {
          skills: {
            fighting: { $gte: 'd8' }
          }
        }
      },
      nervesOfSteel: {
        label: "Nerves of Steel",
        description: "You may ignore 1 point of Wound penalties.",
        requirements: {
          attributes: {
            vigor: { $gte: 'd8' }
          }
        }
      },


      steadyHands: {
        label: "Steady Hands",
        description: "Ignore unstable platform penalty when attacking from a moving vehicle or mount.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },
      sweep: {
        label: "Sweep",
        description: "Attack all adjacent foes at –2 penalty.",
        requirements: {
          skills: {
            fighting: { $gte: 'd8' }
          }
        }
      },
      trademarkWeapon: {
        label: "Trademark Weapon",
        description: "+1 to Fighting or Shooting rolls with a specific weapon; +1 Parry if melee.",
        requirements: {
          skills: {
            $or:{
              fighting: { $gte: 'd8' },
              shooting: { $gte: 'd8' },
            },
          },
        },
      },
      twoFisted: {
        label: "Two-Fisted",
        description: "No multi-action penalty when attacking with a weapon in each hand.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },
      twoGunKid: {
        label: "Two-Gun Kid",
        description: "When using two one-handed ranged weapons, you may fire both at no multi-action penalty.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          }
        }
      },

      // Leadership edges
      command: {
        label: "Command",
        description: "Add +1 to Spirit rolls to recover from being Shaken for all allies within 5\".",
        requirements: {
          attributes: {
            smarts: { $gte: 'd6' }
          }
        }
      },

      // Professional edges
      ace: {
        label: "Ace",
        description: "Ignore up to 2 points of penalties when making Boating, Driving, or Piloting rolls, and rolls made to soak or avoid damage in a vehicle.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          },
          skills: {
            piloting: { $gte: 'd6' }
          }
        }
      },
      acrobat: {
        label: "Acrobat",
        description: "Add +1 to Athletics rolls made for balance or to escape bonds, and +1 to Parry.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          },
          skills: {
            athletics: { $gte: 'd6' }
          }
        }
      },
      assassin: {
        label: "Assassin",
        description: "Gain +2 to damage when making a successful and completely unsuspected attack.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' },
            smarts: { $gte: 'd8' }
          },
          skills: {
            stealth: { $gte: 'd6' },
            fighting: { $gte: 'd6' }
          }
        }
      },
      investigator: {
        label: "Investigator",
        description: "Add +2 to Research and Notice rolls when looking for clues or information.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd8' }
          },
          skills: {
            research: { $gte: 'd6' },
            notice: { $gte: 'd6' }
          }
        }
      },
      jackOfAllTrades: {
        label: "Jack-of-All-Trades",
        description: "Once per session, gain a d6 in a Smarts-based skill you don’t have for the rest of the session.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd10' }
          }
        }
      },
      mcGyver: {
        label: "McGyver",
        description: "Can improvise devices without proper tools or parts using Repair or Electronics.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd8' }
          },
          skills: {
            repair: { $gte: 'd6' },
            electronics: { $gte: 'd6' }
          }
        }
      },
      mrFixIt: {
        label: "Mr. Fix It",
        description: "Gain +2 to Repair rolls and add +2 to minimum result when using Support with Repair.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd8' }
          },
          skills: {
            repair: { $gte: 'd8' }
          }
        }
      },
      scholar: {
        label: "Scholar",
        description: "Gain +2 to any two Smarts-based skills of your choice (typically academics, science, occult, etc).",
        requirements: {
          attributes: {
            smarts: { $gte: 'd8' }
          }
        }
      },
      soldier: {
        label: "Soldier",
        description: "Add +1 to Athletics rolls for throwing grenades and +1 to Shooting with rifles.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          },
          skills: {
            shooting: { $gte: 'd6' }
          }
        }
      },
      thief: {
        label: "Thief",
        description: "Add +1 to Thievery and Athletics (climbing only); +2 when using a climbing kit.",
        requirements: {
          attributes: {
            agility: { $gte: 'd8' }
          },
          skills: {
            thievery: { $gte: 'd6' },
            athletics: { $gte: 'd6' }
          }
        }
      },
      woodsman: {
        label: "Woodsman",
        description: "Add +2 to Survival and Stealth rolls in forest or jungle environments.",
        requirements: {
          attributes: {
            smarts: { $gte: 'd6' }
          },
          skills: {
            survival: { $gte: 'd6' },
            stealth: { $gte: 'd6' }
          }
        }
      }

    },
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
