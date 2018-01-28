import { TypeAliasDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getCommentFromSymbol, getPropertyComment, getParamComment } from '../helpers'
import { toArray, partial } from 'lodash'
import { convertType } from './type'

export function convertAlias (symbol: ts.Symbol): TypeAliasDocNode {
  const alias = toArray(symbol.declarations).find(ts.isTypeAliasDeclaration)!

  // If this is a function, use @param instead of @prop
  const getComment = ts.isFunctionTypeNode(alias.type) ? getParamComment : getPropertyComment

  return {
    name: symbol.name,
    kind: DocNodeKind.typeAlias,
    jsdoc: getCommentFromSymbol(symbol),
    genericTypes: [],
    type: convertType(alias.type, partial(getComment, alias), '')
  }
}
