/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { knex } from 'knex';

// Order is important here, due to foreign key constraints
const DB_TABLES = ['events', 'streams'];

export async function resetDb(knexClient: knex.Knex) {
  await knexClient.transaction(async (trx) => {
    for (let i = 0; i < DB_TABLES.length; i++) {
      const table = DB_TABLES[i];
      await trx(table).delete();
    }
  });
}
