import { TypeAliasDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getCommentFromSymbol, getPropertyComment, getParamComment } from '../helpers'
import { toArray } from 'lodash'
import { convertType } from './type'
import { Context } from './common'

export function convertAlias ({ symbol }: Context): TypeAliasDocNode {
  const alias = toArray(symbol.declarations).find(ts.isTypeAliasDeclaration)!

  // If this is a function, use @param instead of @prop
  const getComment = ts.isFunctionTypeNode(alias.type) ? getParamComment : getPropertyComment

  return {
    name: symbol.name,
    kind: DocNodeKind.typeAlias,
    jsdoc: getCommentFromSymbol(symbol),
    genericTypes: [],
    type: convertType(alias.type, getComment(alias))
  }
}
