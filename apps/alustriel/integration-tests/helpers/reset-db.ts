/*
 * Copyright 2023-2024 Phillip Gates-Shannon. All rights reserved.
 */

import { Knex } from 'knex';

// Order is important here, due to foreign key constraints
const DB_TABLES = ['events', 'streams'];

export async function resetDb(knex: Knex) {
  await knex.transaction(async (trx) => {
    for (let i = 0; i < DB_TABLES.length; i++) {
      const table = DB_TABLES[i];
      await trx(table).delete();
    }
  });
}
