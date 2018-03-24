import { EnumDocNode, DocNodeKind } from '../schema'
import { getCommentFromSymbol, getCommentFromNode } from '../helpers'
import { Symbol, TypeGuards } from 'ts-simple-ast'
import { flatMap, toNumber } from 'lodash'

export function convertEnum (symbol: Symbol): EnumDocNode {
  const declarations = symbol.getDeclarations().filter(TypeGuards.isEnumDeclaration)

  const doc: EnumDocNode = {
    name: symbol.getName(),
    kind: DocNodeKind.enum,
    const: declarations.some(d => d.isConstEnum()),
    jsdoc: getCommentFromSymbol(symbol),
    members: []
  }

  const members = flatMap(declarations, d => d.getMembers())
  let enumIndex = 0

  members.forEach(member => {
    const setValue = member.getValue()
    const value = setValue == null ? enumIndex : setValue
    const index = toNumber(value)
    if (!Number.isNaN(index)) {
      enumIndex = index + 1
    }

    const type = typeof value === 'string' ? 'string' : 'number'
    doc.members.push({
      name: member.getName(),
      kind: DocNodeKind.enumMember,
      jsdoc: getCommentFromNode(member),
      value: value.toString(),
      type
    })
  })

  return doc
}
