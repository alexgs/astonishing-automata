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

import { EVENT_TYPES } from '../character-builder/constants';
import {
  CharacterStartedEvent,
  CharacterStartedEventPayloadSchema,
} from '../character-builder/events/character-started.event';
import {
  StepChangedEvent,
  StepChangedEventPayloadSchema,
} from '../character-builder/events/step-changed.event';
import { TOKENS } from '../provider-tokens';

import { POSTGRES_CHANNEL } from './constants';
import { EventStoreReadModel } from './interfaces';
import { PostgresService } from './postgres.service';

const eventMap = {
  [EVENT_TYPES.STEP_CHANGED]: {
    constructor: StepChangedEvent,
    schema: StepChangedEventPayloadSchema.safeParse.bind(
      StepChangedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.STARTED]: {
    constructor: CharacterStartedEvent,
    schema: CharacterStartedEventPayloadSchema.safeParse.bind(
      CharacterStartedEventPayloadSchema,
    ),
  },
} as const;

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
          (row: EventStoreReadModel) => {
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

  private createEventFromRow(row: EventStoreReadModel) {
    const { constructor: EventConstructor, schema: validator } =
      eventMap[row.type as keyof typeof eventMap];
    if (!EventConstructor) {
      this.logger.error(`Unknown event type: ${row.type}`);
      throw new Error(`Unknown event type: ${row.type}`);
    }

    const result = validator(row.data);
    if (!result.success) {
      const message = `Invalid data for event type: ${row.type} - ${result.error.message}`;
      this.logger.error(message);
      throw new Error(message);
    }

    return new EventConstructor({ ...row, data: result.data }); // Pass full row with validated data
  }
}
