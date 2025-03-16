/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
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
