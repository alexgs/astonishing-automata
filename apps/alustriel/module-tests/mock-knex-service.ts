/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable } from '@nestjs/common';
import { knex } from 'knex';
import { createTracker, MockClient, Tracker } from 'knex-mock-client';

@Injectable()
export class MockKnexService {
  private readonly mockKnex: knex.Knex;
  private readonly tracker: Tracker;

  constructor() {
    this.mockKnex = knex({ client: MockClient, dialect: 'pg' });
    this.tracker = createTracker(this.mockKnex);
  }

  getKnex(): knex.Knex {
    return this.mockKnex;
  }

  getTracker(): Tracker {
    return this.tracker;
  }
}
