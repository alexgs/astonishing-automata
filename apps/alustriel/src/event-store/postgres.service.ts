/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';

import { IPostgresService } from './interfaces';

@Injectable()
export class PostgresService implements IPostgresService {
  private sqlObject: postgres.Sql | null = null;

  constructor(private readonly configService: ConfigService) {}

  private initializeSql() {
    this.sqlObject = postgres({
      database: this.configService.get<string>('DATABASE_NAME'),
      host: this.configService.get<string>('DATABASE_HOST'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      port: this.configService.get<number>('DATABASE_PORT'),
      publications: 'event_publication',
      user: this.configService.get<string>('DATABASE_USER'),
    });
  }

  async close() {
    if (this.sqlObject) {
      await this.sqlObject.end();
    }
  }

  getSql(): postgres.Sql {
    if (!this.sqlObject) {
      this.initializeSql();
    }
    if (!this.sqlObject) {
      throw new Error('Unable to initialize PostgreSQL service');
    }
    return this.sqlObject;
  }
}
