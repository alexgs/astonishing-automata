/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

// eslint-disable-next-line import/named -- ESLint can't find `Knex` for some reason
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
