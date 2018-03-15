import { DocNodeKind, VariableDocNode } from '../schema'
import * as ts from 'typescript'
import { getPropertyComment, getCommentFromSymbol } from '../helpers'
import { } from 'lodash'
import { convertType } from './type'

export function convertVariable (symbol: ts.Symbol): VariableDocNode {
  const declaration = symbol.declarations!.find(ts.isVariableDeclaration)!
  const type = declaration.type || ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)

  const doc: VariableDocNode = {
    name: symbol.name,
    kind: DocNodeKind.variable,
    type: convertType(type, getPropertyComment(declaration)),
    jsdoc: getCommentFromSymbol(symbol)
  }

  return doc
}
