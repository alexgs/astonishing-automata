/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { TOKENS } from '../provider-tokens';

import { POSTGRES_CHANNEL } from './constants';
import { eventMap } from './event-map';
import { EventStoreReadModel } from './interfaces';
import { PostgresService } from './postgres.service';

@Injectable()
export class EventPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventPublisherService.name);
  private unsubscribe: () => void = () => {};

  constructor(
    private readonly eventBus: EventBus,
    @Inject(TOKENS.POSTGRES_SERVICE)
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
          POSTGRES_CHANNEL,
          (row) => {
            if (row) {
              const readModel: EventStoreReadModel = row as EventStoreReadModel;
              this.logger.debug(
                `Publishing event: ${JSON.stringify(readModel)}`,
              );
              const event = this.createEventFromRow(readModel);
              if (event) {
                this.eventBus.publish(event);
              }
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

  // Even though this function returns `unknown`, the events will still work
  // with the event bus since `instanceof` continues to function as expected.
  private createEventFromRow(row: EventStoreReadModel): unknown {
    const map = eventMap[row.type as keyof typeof eventMap];
    if (!map) {
      this.logger.error(`Unknown event type: ${row.type}`);
      throw new Error(`Unknown event type: ${row.type}`);
    }
    const { constructor: EventConstructor, schema: validator } = map;

    const validatorResult = validator(row.data);
    if (!validatorResult.success) {
      const message = `Invalid data for event type: ${row.type} - ${validatorResult.error.message}`;
      this.logger.error(message);
      throw new Error(message);
    }

    return new EventConstructor({ ...row, data: validatorResult.data }); // Pass full row with validated data
  }
}
