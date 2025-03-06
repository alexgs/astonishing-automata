/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import * as env from 'env-var';
// eslint-disable-next-line import/named -- ESLint can't find `Knex` for some reason
import KnexDbClient, { Knex } from 'knex';

let knex: Knex;

export const KnexClient = {
  getKnex: () => {
    if (!knex) {
      const databaseName = env.get('DATABASE_NAME').required().asString();
      const databasePassword = env
        .get('DATABASE_PASSWORD')
        .required()
        .asString();
      const databasePort = env.get('DATABASE_PORT').required().asPortNumber();
      const databaseUser = env.get('DATABASE_USER').required().asString();

      knex = KnexDbClient({
        client: 'pg',
        connection: {
          database: databaseName,
          host: 'localhost',
          port: databasePort,
          user: databaseUser,
          password: databasePassword,
        },
        debug: false,
      });
    }
    return knex;
  },
};
