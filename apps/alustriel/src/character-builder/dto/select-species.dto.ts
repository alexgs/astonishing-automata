/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SelectSpeciesDtoSchema = z.object({
  characterId: z.string(),
  species: z.string(),
});

export class SelectSpeciesDto extends createZodDto(SelectSpeciesDtoSchema) {}
