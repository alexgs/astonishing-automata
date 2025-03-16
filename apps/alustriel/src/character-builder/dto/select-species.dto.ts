/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { readFileSync } from 'fs';
import { createZodDto } from 'nestjs-zod';
import * as yaml from 'yaml';
import { z } from 'zod';

// Load species from YAML
const yamlFile = readFileSync('./data/species.yml', 'utf8');
const speciesList = yaml
  .parse(yamlFile)
  .species.map((s: { id: string }) => s.id);

const SelectSpeciesDtoSchema = z.object({
  characterId: z.string(),
  species: z.string().refine((species) => speciesList.includes(species), {
    message: 'Invalid species selection',
  }),
});

export class SelectSpeciesDto extends createZodDto(SelectSpeciesDtoSchema) {}
