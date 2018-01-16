/**
 * Tests for enumerations
 * @since 0.0.0
 */

/**
 * A basic enum
 */
export enum Test1 {
  /**
   * With docs
   */
  a,
  /**
   * And more docs
   */
  b
}

/**
 * A const enum
 */
export const enum Test2 {
  /**
   * With docs
   */
  a,
  /**
   * And more docs
   */
  b
}

/**
 * With values
 */
export enum Test3 {
  /**
   * A 2^0 value
   */
  a = 1,
  /**
   * A 2^1 value
   */
  b = 2
}

/**
 * Merged declaration
 */
export enum Test3 {
  /**
   * A 2^2 value
   */
  c = 4
}

/**
 * With string values
 *
 * @example
 * Check if a type is Test3.a
 *
 * ```js
 * if (member.type === Test3.a) {
 *     // Do something
 * }
 * ```
 */
declare enum Test4 {
  /**
   * Letter 1
   */
  a = 'a',
  /**
   * A potentially problematic value
   */
  problem = '"`\'<>'
}

export { Test4 }

/**
 * Messy indexes
 */
export enum Test5 {
  a = 0,
  b,
  c = 4,
  d = -1,
  e,
  f
}
