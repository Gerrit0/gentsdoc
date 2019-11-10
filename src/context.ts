import * as ts from 'typescript'
import * as tsdoc from '@microsoft/tsdoc'

export class Context {
  readonly checker: ts.TypeChecker
  readonly symbol: ts.Symbol
  readonly parser: tsdoc.TSDocParser
  readonly parent?: Context

  constructor (checker: ts.TypeChecker, symbol: ts.Symbol, parser: tsdoc.TSDocParser, parent?: Context) {
    this.checker = checker
    this.symbol = symbol
    this.parser = parser
    this.parent = parent
  }

  forSymbol (symbol: ts.Symbol) {
    return new Context(this.checker, symbol, this.parser, this)
  }

  get name () {
    return this.symbol.name
  }

  get reference () {
    if (this.hasFlag(ts.SymbolFlags.Class)) {
      return `(${this.name}:class)`
    } else if (this.hasFlag(ts.SymbolFlags.Enum)) {
      return `(${this.name}:enum)`
    }
    return this.name
  }

  get fullReference (): string {
    if (this.parent) {
      return this.parent.fullReference + '.' + this.reference
    }
    return this.reference
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

  getLeadingCommentRanges () {
    return ts.getLeadingCommentRanges(
      this.declaration.getSourceFile().getFullText(),
      this.declaration.getFullStart()
    ) || []
  }

  getDocComment (): tsdoc.DocComment | undefined {
    const ranges = this.getLeadingCommentRanges()
    if (ranges.length === 0) return
    const lastRange = ranges[ranges.length - 1]
    const range = tsdoc.TextRange.fromStringRange(this.declaration.getSourceFile().getFullText(), lastRange.pos, lastRange.end)
    return this.parser.parseRange(range).docComment
  }

  hasFlag (flag: ts.SymbolFlags): boolean {
    return (this.symbol.flags & flag) !== 0
  }
}
