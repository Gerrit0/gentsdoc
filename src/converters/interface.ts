import { InterfaceDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { toArray, remove, partial, flatMap } from 'lodash'
import { warn, getCommentFromSymbol, isTSNode, resolveName, getCommentFromNode, resolveExpression } from '../helpers'
import { convertSignature, convertTypeParameter } from './function'
import { convertType } from './type'
import { convertProperty } from './property'

export function convertInterface (symbol: ts.Symbol, _checker: ts.TypeChecker): InterfaceDocNode {
  // const int = toArray(symbol.declarations).find(ts.isInterfaceDeclaration)!
  const doc: InterfaceDocNode = {
    name: symbol.name,
    kind: DocNodeKind.typeInterface,
    jsdoc: getCommentFromSymbol(symbol),
    genericTypes: [],
    methods: [],
    properties: [],
    signatures: [],
    indexes: [],
    constructors: [],
    extends: []
  }

  const int = toArray(symbol.declarations).find(ts.isInterfaceDeclaration)
  if (int) { // Should always pass
    doc.genericTypes = toArray(int.typeParameters).map(partial(convertTypeParameter, int))
    const extendedFrom = toArray(int.heritageClauses)
      .filter(clause => clause.token === ts.SyntaxKind.ExtendsKeyword)
    doc.extends = flatMap(extendedFrom, ex => ex.types.map(resolveExpression))
  }

  toArray(symbol.declarations)
    .filter(ts.isInterfaceDeclaration)
    .map(declaration => declaration.members)
    .reduce<ts.TypeElement[]>((all, members) => all.concat(members), [])
    .filter(isTSNode)
    .forEach((node: ts.Node) => {
      if (ts.isMethodSignature(node)) {
        resolveMethod(node)
      } else if (ts.isCallSignatureDeclaration(node)) {
        doc.signatures.push(convertSignature(node))
      } else if (ts.isPropertySignature(node)) {
        // Should never remove anything.
        remove(doc.properties, prop => resolveName(node.name) === prop.name)
        doc.properties.push(convertProperty(node))
      } else if (ts.isIndexSignatureDeclaration(node)) {
        doc.indexes.push({
          kind: DocNodeKind.index,
          name: resolveName(node.parameters[0].name),
          jsdoc: getCommentFromNode(node),
          keyType: convertType(node.parameters[0].type),
          type: convertType(node.type)
        })
      } else if (ts.isConstructSignatureDeclaration(node)) {
        doc.constructors.push(convertSignature(node))
      } else {
        warn(`Unknown node type in interface (kind: ${ts.SyntaxKind[node.kind]})`)
      }
    })

  function resolveMethod (node: ts.MethodSignature): void {
    const name = resolveName(node.name)

    const functionDoc = doc.methods.find(method => method.name === name) || {
      kind: DocNodeKind.function,
      name,
      signatures: []
    }

    functionDoc.signatures.push(convertSignature(node))

    if (!doc.methods.includes(functionDoc)) doc.methods.push(functionDoc)
  }

  return doc
}
