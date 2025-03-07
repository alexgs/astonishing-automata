/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';

import { KnexClient } from './knex-client';

let knexClient: knex.Knex;

beforeAll(async () => {
  knexClient = KnexClient.getKnex();
});

afterAll(async () => {
  await knexClient.destroy();
});
