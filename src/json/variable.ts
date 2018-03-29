import { Node, Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromSymbol, getPropertyComment } from '../helpers'
import { DocNodeKind, VariableDocNode } from '../schema'
import { convertType } from './type'

export function convertVariable (symbol: Symbol): VariableDocNode {
  const declaration = symbol.getDeclarations().find(TypeGuards.isVariableDeclaration)!
  let docNode: Node = declaration // Should be a VariableStatement eventually.
  do {
    docNode = docNode.getParentOrThrow()
  } while (!TypeGuards.isJSDocableNode(docNode))

  const doc: VariableDocNode = {
    name: symbol.getName(),
    kind: DocNodeKind.variable,
    type: convertType(declaration.getType(), declaration.getTypeNode(), getPropertyComment(docNode)),
    jsdoc: getCommentFromSymbol(symbol)
  }

  return doc
}
