/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

// constraintService.test.ts
import { evaluateTest } from './constraint-service';

describe('evaluateTest', () => {
  it('supports $eq', () => {
    expect(evaluateTest({ $eq: 42 }, 42)).toBe(true);
  });
});
