import { describe, expect, test } from '@jest/globals';

import {
  computePrecisionDrop,
  computePrecisionDropFromInterval,
} from './index.js';

describe('computePrecisionDrop', () => {
  describe('for lower boundary', () => {
    const rule = {
      hardLimit: 10,
      softLimit: 20,
      decreaseFunction: 'linear',
    } as const;

    test('should work before the soft limit', () => {
      expect(computePrecisionDrop(42, rule, 'lower', 100)).toBe(100);
    });

    test('should work after the hard limit', () => {
      expect(computePrecisionDrop(4, rule, 'lower', 100)).toBe(0);
    });

    test('should work between limits', () => {
      expect(computePrecisionDrop(15, rule, 'lower', 100)).toBe(50);
    });

    test('should work at hard limit', () => {
      expect(computePrecisionDrop(10, rule, 'lower', 0)).toBe(0);
    });

    test('should work at soft limit', () => {
      expect(computePrecisionDrop(20, rule, 'lower', 100)).toBe(100);
    });
  });

  describe('for higher boundary', () => {
    const rule = {
      softLimit: 50,
      hardLimit: 70,
      decreaseFunction: 'linear',
    } as const;

    test('should work before the soft limit', () => {
      expect(computePrecisionDrop(42, rule, 'higher', 100)).toBe(100);
    });

    test('should work after the hard limit', () => {
      expect(computePrecisionDrop(80, rule, 'higher', 100)).toBe(0);
    });

    test('should work between limits', () => {
      expect(computePrecisionDrop(60, rule, 'higher', 100)).toBe(50);
    });

    test('should work at hard limit', () => {
      expect(computePrecisionDrop(70, rule, 'higher', 0)).toBe(0);
    });

    test('should work at soft limit', () => {
      expect(computePrecisionDrop(50, rule, 'higher', 100)).toBe(100);
    });
  });
});

describe('computePrecisionDropFromInterval', () => {
  const rules = {
    lower: {
      hardLimit: 10,
      softLimit: 20,
      decreaseFunction: 'linear',
    },
    higher: {
      softLimit: 50,
      hardLimit: 70,
      decreaseFunction: 'linear',
    },
  } as const;

  test('should work outside rules', () => {
    expect(computePrecisionDropFromInterval(42, rules, 100)).toBe(100);
  });

  test('should trigger soft limits rules', () => {
    expect(computePrecisionDropFromInterval(12, rules, 100)).toBe(20);
  });

  test('should trigger hard limits rules', () => {
    expect(computePrecisionDropFromInterval(60, rules, 100)).toBe(50);
  });
});
