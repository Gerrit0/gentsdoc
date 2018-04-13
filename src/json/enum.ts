import { chain } from 'ramda'
import { Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromNode, getCommentFromSymbol } from '../helpers'
import { DocNodeKind, EnumDocNode } from './schema'

export function convertEnum (symbol: Symbol): EnumDocNode {
  const declarations = symbol.getDeclarations().filter(TypeGuards.isEnumDeclaration)

  const doc: EnumDocNode = {
    name: symbol.getName(),
    kind: DocNodeKind.enum,
    const: declarations.some(d => d.isConstEnum()),
    jsdoc: getCommentFromSymbol(symbol),
    members: []
  }

  const members = chain(d => d.getMembers(), declarations)
  let enumIndex = 0

  members.forEach(member => {
    const setValue = member.getValue()
    const value = setValue == null ? enumIndex : setValue
    if (typeof value === 'number') {
      enumIndex = value + 1
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
