import { Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromSymbol, getParamComment, getPropertyComment } from '../helpers'
import { DocNodeKind, TypeAliasDocNode } from './schema'
import { convertType } from './type'

export function convertAlias (symbol: Symbol): TypeAliasDocNode {
  const alias = symbol.getDeclarations().find(TypeGuards.isTypeAliasDeclaration)!

  // If this is a function, use @param instead of @prop
  const typeNode = alias.getTypeNodeOrThrow()
  const getComment = TypeGuards.isFunctionTypeNode(typeNode) ?
    getParamComment : getPropertyComment

  return {
    name: symbol.getName(),
    kind: DocNodeKind.typeAlias,
    jsdoc: getCommentFromSymbol(symbol),
    genericTypes: [],
    type: convertType(alias.getType(), typeNode, getComment(alias))
  }
}
