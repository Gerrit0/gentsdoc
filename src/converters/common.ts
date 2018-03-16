import * as ts from 'typescript'

export interface Context {
  symbol: ts.Symbol,
  checker: ts.TypeChecker
}
