/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Knex } from 'knex';

import { KnexClient } from './knex-client';

let knex: Knex;

beforeAll(async () => {
  knex = KnexClient.getKnex();
});

afterAll(async () => {
  await knex.destroy();
});
