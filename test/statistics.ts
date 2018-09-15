import { ASF } from './stat'

export { asdf } from './stat'
export { test } from './another'

export class Statistics {
  /**
   * Adds two numbers.
   *
   * @remarks
   * Here's a {@customInline some data}.
   *
   * @customBlock
   * Here's a custom block tag.
   *
   * @param x - The first input number
   * @param x.a - The actual number
   * @param y - The second input number
   * @returns The sum of `x` and `y`
   *
   * @beta @customModifier
   */
  public static add (x: { a: number }, y: number): number {
    new ASF(x.toString()).test()
    return x.a + y
  }
}
