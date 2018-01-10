import { EnumDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getCommentFromSymbol, resolveName, getCommentFromNode, resolveExpression, getNodeSource } from '../helpers'
import { toArray, toNumber, isNaN } from 'lodash'

export function convertEnum (symbol: ts.Symbol, file: ts.SourceFile): EnumDocNode {
  const doc: EnumDocNode = {
    name: symbol.name,
    kind: DocNodeKind.enum,
    const: false,
    jsdoc: getCommentFromSymbol(symbol),
    members: [],
    sources: []
  }

  const declarations = toArray(symbol.declarations)
    .filter(ts.isEnumDeclaration)

  doc.const = declarations
    .map(d => toArray(d.modifiers))
    .some(d =>
      d.some(mod => mod.kind === ts.SyntaxKind.ConstKeyword)
    )

  declarations.forEach(declaration => doc.sources.push(getNodeSource(declaration, file)))

  const members = declarations
    .map(declaration => declaration.members)
    .reduce<ts.EnumMember[]>((all, members) => all.concat(toArray(members)), [])

  let enumIndex = 0

  members.forEach(member => {
    const value = member.initializer ? resolveExpression(member.initializer) : enumIndex.toString()
    const index = toNumber(value)
    if (!isNaN(index)) {
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
      value,
      source: getNodeSource(member, file)
    })
  })

  return doc
}
