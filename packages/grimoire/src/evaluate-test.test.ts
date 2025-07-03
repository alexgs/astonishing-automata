/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ConstraintError } from './errors';
import { evaluateTest } from './evaluate-test';

describe('Function `evaluateTest`', () => {
  describe('operator `$eq`', () => {
    it('returns `true` for equal values', () => {
      expect(evaluateTest({ $eq: 42 }, 42)).toBe(true);
      expect(evaluateTest({ $eq: 'foo' }, 'foo')).toBe(true);
    });

    it('returns `false` for non-equal values', () => {
      expect(evaluateTest({ $eq: 42 }, 41)).toBe(false);
      expect(evaluateTest({ $eq: 'foo' }, 'bar')).toBe(false);
    });

    it('throws an error for complex types', () => {
      expect(() => evaluateTest({ $eq: { foo: 'bar' } }, { foo: 'bar' }))
        .toThrow(ConstraintError);
    });
  });

  describe('operator `$neq`', () => {
    it('returns `true` for different values', () => {
      expect(evaluateTest({ $neq: 42 }, 41)).toBe(true);
      expect(evaluateTest({ $neq: 'foo' }, 'bar')).toBe(true);
    });

    it('returns `false` for equal values', () => {
      expect(evaluateTest({ $neq: 42 }, 42)).toBe(false);
    });

    it('throws an error for complex types', () => {
      expect(() => evaluateTest({ $neq: { foo: 'bar' } }, { foo: 'baz' }))
        .toThrow(ConstraintError);
    });
  });

  describe('operator `$lt`', () => {
    it('returns `true` if value is less than the target', () => {
      expect(evaluateTest({ $lt: 10 }, 5)).toBe(true);
    });

    it('returns `false` if value is greater or equal', () => {
      expect(evaluateTest({ $lt: 10 }, 10)).toBe(false);
      expect(evaluateTest({ $lt: 10 }, 15)).toBe(false);
    });
  });

  describe('operator `$lte`', () => {
    it('returns `true` if value is less than or equal to the target', () => {
      expect(evaluateTest({ $lte: 10 }, 5)).toBe(true);
      expect(evaluateTest({ $lte: 10 }, 10)).toBe(true);
    });

    it('returns `false` if value is greater than the target', () => {
      expect(evaluateTest({ $lte: 10 }, 15)).toBe(false);
    });
  });

  describe('operator `$gt`', () => {
    it('returns `true` if value is greater than the target', () => {
      expect(evaluateTest({ $gt: 10 }, 15)).toBe(true);
    });

    it('returns `false` if value is less than or equal to the target', () => {
      expect(evaluateTest({ $gt: 10 }, 10)).toBe(false);
      expect(evaluateTest({ $gt: 10 }, 5)).toBe(false);
    });
  });

  describe('operator `$gte`', () => {
    it('returns `true` if value is greater than or equal to the target', () => {
      expect(evaluateTest({ $gte: 10 }, 10)).toBe(true);
      expect(evaluateTest({ $gte: 10 }, 15)).toBe(true);
    });

    it('returns `false` if value is less than the target', () => {
      expect(evaluateTest({ $gte: 10 }, 5)).toBe(false);
    });
  });

  describe('operator `$in`', () => {
    it('returns `true` if value is in the array', () => {
      expect(evaluateTest({ $in: ['a', 'b', 'c'] }, 'b')).toBe(true);
    });

    it('returns `false` if value is not in the array', () => {
      expect(evaluateTest({ $in: ['a', 'b', 'c'] }, 'd')).toBe(false);
    });
  });

  describe('operator `$nin`', () => {
    it('returns `true` if value is not in the array', () => {
      expect(evaluateTest({ $nin: ['a', 'b', 'c'] }, 'x')).toBe(true);
    });

    it('returns `false` if value is in the array', () => {
      expect(evaluateTest({ $nin: ['a', 'b', 'c'] }, 'a')).toBe(false);
    });
  });

  describe('operator `$count`', () => {
    it('evaluates a sub-condition against the array length', () => {
      expect(evaluateTest({ $count: { $eq: 2 } }, [1, 2])).toBe(true);
      expect(evaluateTest({ $count: { $lt: 5 } }, [1, 2, 3])).toBe(true);
      expect(evaluateTest({ $count: { $gt: 3 } }, [1, 2, 3, 4])).toBe(true);
    });

    it('returns `false` if array length does not satisfy the condition', () => {
      expect(evaluateTest({ $count: { $eq: 2 } }, [1])).toBe(false);
      expect(evaluateTest({ $count: { $gte: 5 } }, [1, 2])).toBe(false);
    });

    it('returns `false` if value is not an array', () => {
      expect(evaluateTest({ $count: { $eq: 1 } }, 42)).toBe(false);
      expect(evaluateTest({ $count: { $eq: 1 } }, null)).toBe(false);
    });
  });
});
