/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { STEPS } from '../../state-machine/constants';
import { StepName } from '../../state-machine/types';

// Convert STEPS object values to a tuple type required by z.enum()
const stepValues = Object.values(STEPS) as [string, ...string[]];

const ChangeStepDtoSchema = z.object({
  characterId: z.string().uuid(),
  targetStep: z.enum(stepValues) as z.ZodType<StepName>, // Zod enum that only accepts values from STEPS
});

// Type inference from the schema
export class ChangeStepDto extends createZodDto(ChangeStepDtoSchema) {}
