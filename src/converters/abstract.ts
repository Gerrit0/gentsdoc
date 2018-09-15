import * as ts from 'typescript'
import { Application } from '../application'

export abstract class AbstractConverter {
  constructor (public readonly application: Application) {}

  get logger () {
    return this.application.logger
  }

  /**
   * Returns true if the converter supports converting the symbol. In general, this will
   * be equivalent to checking if any of the declarations are of an expected type.
   */
  abstract supports (symbol: ts.Symbol): boolean

  /**
   * Converts the provided symbol. Will only be called if supports(symbol) returns true.
   * @param symbol
   */
  abstract convert (symbol: ts.Symbol): void
}
