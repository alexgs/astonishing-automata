/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ICommand } from '@nestjs/cqrs';

export class PatchCharacterCommand implements ICommand {
  constructor(
    public readonly characterId: string,
    public readonly data: Record<string, unknown>,
  ) {}
}
