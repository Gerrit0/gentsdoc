import { Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromSymbol, getPropertyComment, getJSDocableNode } from '../helpers'
import { DocNodeKind, VariableDocNode } from './schema'
import { convertType } from './type'

export function convertVariable (symbol: Symbol): VariableDocNode {
  const declaration = symbol.getDeclarations().find(TypeGuards.isVariableDeclaration)!
  let docNode = getJSDocableNode(declaration)

  const doc: VariableDocNode = {
    name: symbol.getName(),
    kind: DocNodeKind.variable,
    type: convertType(declaration.getType(), declaration.getTypeNode(), getPropertyComment(docNode)),
    jsdoc: getCommentFromSymbol(symbol)
  }

  return doc
}
