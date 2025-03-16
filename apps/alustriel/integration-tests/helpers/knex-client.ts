/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import * as env from 'env-var';
import { knex } from 'knex';

let knexClient: knex.Knex;

export const KnexClient = {
  getKnex: () => {
    if (!knexClient) {
      const databaseName = env.get('DATABASE_NAME').required().asString();
      const databasePassword = env
        .get('DATABASE_PASSWORD')
        .required()
        .asString();
      const databasePort = env.get('DATABASE_PORT').required().asPortNumber();
      const databaseUser = env.get('DATABASE_USER').required().asString();

      knexClient = knex({
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
    return knexClient;
  },
};
