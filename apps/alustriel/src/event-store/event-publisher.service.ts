/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import * as postgres from 'postgres';
import { EVENT_TYPES } from '../character-builder/constants';
import { StepChangedEvent } from '../character-builder/events/step-changed.event';
import { EventReadModel } from './interfaces';

@Injectable()
export class EventPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventPublisherService.name);
  private unsubscribe: () => void = () => {};

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
  ) {}

  async onModuleDestroy() {
    try {
      this.unsubscribe();
      this.logger.debug('Unsubscribed from PostgreSQL event stream.');
    } catch (error) {
      this.logger.error(
        'Error unsubscribing from PostgreSQL event stream:',
        error,
      );
    }
  }

  async onModuleInit() {
    const maxRetries = 5;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const sql = postgres({
          database: this.configService.get<string>('DATABASE_NAME'),
          host: this.configService.get<string>('DATABASE_HOST'),
          password: this.configService.get<string>('DATABASE_PASSWORD'),
          port: this.configService.get<number>('DATABASE_PORT'),
          publications: 'event_publication',
          user: this.configService.get<string>('DATABASE_USER'),
        });

        const subscriptionHandle = await sql.subscribe(
          'insert:events',
          (row: EventReadModel) => {
            this.logger.debug(`Publishing event: ${JSON.stringify(row)}`);
            try {
              const event = this.createEventFromRow(row);
              this.eventBus.publish(event);
            } catch (error) {
              this.logger.error('Error creating event from row:', error);
            }
          },
          () => {
            this.logger.debug('Connected to PostgreSQL event stream.');
          },
        );

        this.unsubscribe = subscriptionHandle.unsubscribe;
        return;
      } catch (error) {
        this.logger.error(
          `Event subscription failed (attempt ${attempt}):`,
          error,
        );
        if (attempt === maxRetries) throw error;
        await new Promise((res) => setTimeout(res, 2000 * attempt)); // Exponential backoff
      }
    }
  }

  private createEventFromRow(row: EventReadModel) {
    switch (row.type) {
      case EVENT_TYPES.STEP_CHANGED:
        return new StepChangedEvent(row.stream_id, row.data.step as string);
      default:
        throw new Error(`Unknown event type: ${row.type}`);
    }
  }
}
