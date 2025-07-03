/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { readFileSync } from 'fs';
import { createZodDto } from 'nestjs-zod';
import * as yaml from 'yaml';
import { z } from 'zod';

// Load species from YAML
const yamlFile = readFileSync('./data/classes.yml', 'utf8');
const classesList = yaml
  .parse(yamlFile)
  .classes.map((s: { id: string }) => s.id);

const SelectClassDtoSchema = z.object({
  characterId: z.string(),
  className: z.string().refine((className) => classesList.includes(className), {
    message: 'Invalid class selection',
  }),
});

/**
 * @deprecated
 */
export class SelectClassDto extends createZodDto(SelectClassDtoSchema) {}
