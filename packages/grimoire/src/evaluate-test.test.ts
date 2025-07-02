/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { evaluateTest } from './evaluate-test';

describe('Function `evaluateTest`', () => {
  describe('operator `$eq`', () => {
    it('returns `true` for equal numbers', () => {
      expect(evaluateTest({ $eq: 42 }, 42)).toBe(true);
    });

    it('returns `false` for different numbers', () => {
      expect(evaluateTest({ $eq: 41 }, 42)).toBe(false);
    });

    it('returns `true` for equal strings', () => {
      expect(evaluateTest({ $eq: 'hello' }, 'hello')).toBe(true);
    });

    it('returns `false` for different strings', () => {
      expect(evaluateTest({ $eq: 'hello' }, 'goodbye')).toBe(false);
    });
  });
});
