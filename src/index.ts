export const DECREASING_FUNCTIONS_NAMES = [
  'linear',
  'easeInSine',
  'easeOutSine',
  'easeInOutSine',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'stepStart',
  'stepMiddle',
  'stepEnd',
] as const;

export type DecreasingFunctionName =
  (typeof DECREASING_FUNCTIONS_NAMES)[number];
export type DecreasingFunction = (x: number) => number;
export interface DecreasingRule {
  softLimit: number;
  hardLimit: number;
  decreaseFunction: DecreasingFunctionName;
}

export const DECREASING_FUNCTIONS: Record<
  DecreasingFunctionName,
  DecreasingFunction
> = {
  linear: (x: number) => x,
  easeInSine: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
  easeOutSine: (x: number) => Math.sin((x * Math.PI) / 2),
  easeInOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  easeInQuad: (x: number) => x * x,
  easeOutQuad: (x: number) => 1 - (1 - x) * (1 - x),
  easeInOutQuad: (x: number) =>
    x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2,
  easeInCubic: (x: number) => x * x * x,
  easeOutCubic: (x: number) => 1 - (1 - x) ** 3,
  easeInOutCubic: (x: number) =>
    x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2,
  stepStart: (x: number) => (x > 0 ? 1 : 0),
  stepMiddle: (x: number) => (x >= 0.5 ? 1 : 0),
  stepEnd: (x: number) => (x >= 1 ? 1 : 0),
};

/**
 * Compute precision drop from the given rule
 */
export function computePrecisionDrop(
  value: number,
  { softLimit, hardLimit, decreaseFunction }: DecreasingRule,
  kind: 'lower' | 'higher',
  defaultPrecision: number,
): number {
  if (kind === 'lower') {
    if (value <= hardLimit) {
      return 0;
    }
    if (value >= softLimit) {
      return defaultPrecision;
    }
    return (
      DECREASING_FUNCTIONS[decreaseFunction](
        (value - hardLimit) / (softLimit - hardLimit),
      ) * defaultPrecision
    );
  } else {
    if (value >= hardLimit) {
      return 0;
    }
    if (value <= softLimit) {
      return defaultPrecision;
    }

    return (
      DECREASING_FUNCTIONS[decreaseFunction](
        (hardLimit - value) / (hardLimit - softLimit),
      ) * defaultPrecision
    );
  }
}

/**
 * Compute precision drop from the given rules
 */
export function computePrecisionDropFromInterval(
  value: number,
  {
    lower,
    higher,
  }: {
    lower?: DecreasingRule;
    higher?: DecreasingRule;
  },
  defaultPrecision: number,
): number {
  if (lower && value <= lower.softLimit) {
    return computePrecisionDrop(value, lower, 'lower', defaultPrecision);
  }
  if (higher && value >= higher.softLimit) {
    return computePrecisionDrop(value, higher, 'higher', defaultPrecision);
  }
  return defaultPrecision;
}
