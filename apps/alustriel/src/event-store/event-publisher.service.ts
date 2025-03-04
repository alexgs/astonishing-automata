/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EVENT_TYPES } from '../character-builder/constants';
import { StepChangedEvent } from '../character-builder/events/step-changed.event';
import { EventReadModel } from './interfaces';
import { PostgresService } from './postgres.service';

@Injectable()
export class EventPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventPublisherService.name);
  private unsubscribe: () => void = () => {};

  constructor(
    private readonly eventBus: EventBus,
    private readonly postgresService: PostgresService,
  ) {}

  async onModuleDestroy() {
    try {
      this.unsubscribe();
      await this.postgresService.close();
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
        const sql = this.postgresService.getSql();
        const subscriptionHandle = await sql.subscribe(
          'insert:events',
          (row: EventReadModel) => {
            this.logger.debug(`Publishing event: ${JSON.stringify(row)}`);
            const event = this.createEventFromRow(row);
            if (event) {
              this.eventBus.publish(event);
            }
          },
          () => {
            // Callback on initial connect and potential reconnects
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
