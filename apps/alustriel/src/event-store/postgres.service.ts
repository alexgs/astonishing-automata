/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';

@Injectable()
export class PostgresService {
  private sqlObject: postgres.Sql;

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
    return this.sqlObject;
  }
}
