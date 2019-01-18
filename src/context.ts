import * as ts from 'typescript'

export class Context {
  readonly checker: ts.TypeChecker
  readonly symbol: ts.Symbol

  constructor (checker: ts.TypeChecker, symbol: ts.Symbol) {
    this.checker = checker
    this.symbol = symbol
  }

  forSymbol (symbol: ts.Symbol) {
    return new Context(this.checker, symbol)
  }

  get name () {
    return this.symbol.name
  }

  get exports (): ts.Symbol[] {
    const result: ts.Symbol[] = []
    if (this.symbol.exports) {
      this.symbol.exports.forEach(v => result.push(v))
    }
    return result
  }

  get exportContexts () {
    return this.exports.map(e => this.forSymbol(e))
  }

  get declaration () {
    return this.symbol.valueDeclaration
  }

  get declarations () {
    return this.symbol.declarations
  }
}
