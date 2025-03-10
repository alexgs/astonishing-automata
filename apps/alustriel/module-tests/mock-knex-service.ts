/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';
import { knex } from 'knex';

@Injectable()
export class MockKnexService {
  // A partial mock of the Knex object with the methods you expect to call;
  // extend this with additional methods as needed.
  private readonly mockKnex: Partial<knex.Knex>;

  constructor() {
    this.mockKnex = {
      // These mocks return `this` to allow method chaining, similar to Knex's API.
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),

      // For methods that might return a promise or a value, you can customize
      // the mock implementation.
      raw: jest.fn().mockResolvedValue([]),

      // Add any additional methods as your application requires.
    };
  }

  getKnex(): knex.Knex {
    // Return the mock object, cast as a full Knex instance.
    return this.mockKnex as knex.Knex;
  }
}
