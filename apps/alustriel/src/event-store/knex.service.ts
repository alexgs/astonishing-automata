/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { knex } from 'knex';

@Injectable()
export class KnexService implements OnModuleDestroy {
  private knexObject: knex.Knex;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  private initializeKnex() {
    this.knexObject = knex({
      client: 'pg',
      connection: {
        database: this.configService.get<string>('DATABASE_NAME'),
        host: this.configService.get<string>('DATABASE_HOST'),
        password: this.configService.get<string>('DATABASE_PASSWORD'),
        port: this.configService.get<number>('DATABASE_PORT'),
        user: this.configService.get<string>('DATABASE_USER'),
      },
      debug: false,
    });
  }

  getKnex(): knex.Knex {
    if (!this.knexObject) {
      this.logger.debug('Initializing Knex connection.');
      this.initializeKnex();
    }
    return this.knexObject;
  }

  async onModuleDestroy() {
    if (this.knexObject) {
      await this.knexObject.destroy();
      this.logger.debug('Knex connection destroyed.');
    }
  }
}
