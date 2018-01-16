import { TypeAliasDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getCommentFromSymbol, getPropertyComment, getParamComment } from '../index'
import { toArray, partial } from 'lodash'
import { convertType } from './type'

export function convertAlias (symbol: ts.Symbol): TypeAliasDocNode {
  const alias = toArray(symbol.declarations).find(ts.isTypeAliasDeclaration)!

  const jsdoc = getCommentFromSymbol(symbol)

  // If this is a function, use @param instead of @prop
  const getComment = ts.isFunctionTypeNode(alias.type) ? getParamComment : getPropertyComment

  return {
    name: symbol.name,
    kind: DocNodeKind.typeAlias,
    jsdoc: {
      ...jsdoc,
      tags: jsdoc.tags.filter(tag => !['prop', 'property', 'param'].includes(tag.tagName))
    },
    genericTypes: [],
    type: convertType(alias.type, partial(getComment, alias), '')
  }
}
