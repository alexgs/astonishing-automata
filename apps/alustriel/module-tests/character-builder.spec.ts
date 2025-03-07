/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { CharacterBuilderModule } from '../src/character-builder/character-builder.module';
import { TOKENS } from '../src/provider-tokens';

import { mockPostgresService } from './mock-postgres-service';

describe('Character Builder module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CharacterBuilderModule,
        ConfigModule.forRoot({
          envFilePath: '../../../.env',
        }),
        CqrsModule.forRoot(),
      ],
      providers: [
        {
          provide: TOKENS.POSTGRES_SERVICE,
          useValue: mockPostgresService,
        },
      ],
    })
      .overrideProvider(TOKENS.POSTGRES_SERVICE)
      .useValue(mockPostgresService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('is defined', () => {
    expect(app.get(CharacterBuilderModule)).toBeDefined();
  });
});
