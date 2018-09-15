/**
 * An ignored comment.
 */

/**
 * An enum comment
 * @remarks
 * Test
 */
export const enum A {
  /**
   * A doc comment!
   */
  a = -123,
  b,
  c
}

/**
 * A longer comment that will be preferred. {@link https://typescriptlang.org | Typescript}
 * Another {@link https://typescriptlang.org}
 *
 * @remarks
 * Test remarks
 */
export const enum A {
  f = 'test'
}

/**
 * Documentation for B
 */
export enum B {
  z,
  b,
  c
}
