import { EnumDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getCommentFromSymbol, resolveName, getCommentFromNode, resolveExpression } from '../helpers'
import { toArray, toNumber, flatMap } from 'lodash'

export function convertEnum (symbol: ts.Symbol): EnumDocNode {
  const doc: EnumDocNode = {
    name: symbol.name,
    kind: DocNodeKind.enum,
    const: false,
    jsdoc: getCommentFromSymbol(symbol),
    members: []
  }

  const declarations = toArray(symbol.declarations)
    .filter(ts.isEnumDeclaration)

  doc.const = flatMap(declarations, d => toArray(d.modifiers))
    .some(mod => mod.kind === ts.SyntaxKind.ConstKeyword)

  const members = flatMap(declarations, d => toArray(d.members))

  let enumIndex = 0

  members.forEach(member => {
    const value = member.initializer ? resolveExpression(member.initializer) : enumIndex.toString()
    const index = toNumber(value)
    if (!Number.isNaN(index)) {
      enumIndex = index + 1
    }

    const type = !member.initializer ? 'number' :
      ts.isStringLiteral(member.initializer) ? 'string' :
      'number'

    doc.members.push({
      name: resolveName(member.name),
      kind: DocNodeKind.enumMember,
      jsdoc: getCommentFromNode(member),
      type,
      value
    })
  })

  return doc
}
