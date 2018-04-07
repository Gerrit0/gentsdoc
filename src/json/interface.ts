import { flatMap } from 'lodash'
import { FunctionTypeNode, MethodSignature, PropertySignature, Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromNode, getCommentFromSymbol } from '../helpers'
import { DocNodeKind, InterfaceDocNode } from './schema'
import { convertFunctionDeclaration, convertTypeParameter, convertFunctionTypeNode } from './function'
import { convertProperty } from './property'
import { convertType } from './type'

export function convertInterface (symbol: Symbol): InterfaceDocNode {
  const doc: InterfaceDocNode = {
    name: symbol.getName(),
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

  const int = symbol.getDeclarations().find(TypeGuards.isInterfaceDeclaration)
  if (int) { // Should always pass
    doc.genericTypes = int.getTypeParameters().map(param => convertTypeParameter(int, param))
    doc.extends = int.getExtends().map(e => e.getText())
  }

  const declarations = symbol.getDeclarations()
    .filter(TypeGuards.isInterfaceDeclaration)

  flatMap(declarations, d => d.getMembers())
    .forEach(node => {
      if (TypeGuards.isMethodSignature(node)) {
        resolveMethod(node)

      } else if (TypeGuards.isCallSignatureDeclaration(node)) {
        doc.signatures.push(convertFunctionDeclaration(node))

      } else if (TypeGuards.isPropertySignature(node)) {
        const typeNode = node.getTypeNode()
        if (typeNode && TypeGuards.isFunctionTypeNode(typeNode)) {
          resolveMethod(node)
          return
        }
        doc.properties.push(convertProperty(node))

      } else if (TypeGuards.isIndexSignatureDeclaration(node)) {
        doc.indexes.push({
          kind: DocNodeKind.index,
          name: node.getKeyName(),
          jsdoc: getCommentFromNode(node),
          keyType: convertType(node.getKeyType(), node.getKeyTypeNode()),
          type: convertType(node.getReturnType(), node.getReturnTypeNode())
        })

      } else if (TypeGuards.isConstructSignatureDeclaration(node)) {
        doc.constructors.push(convertFunctionDeclaration(node))

      }
    })

  function resolveMethod (node: MethodSignature | PropertySignature): void {
    const name = node.getName()

    const functionDoc = doc.methods.find(method => method.name === name) || {
      kind: DocNodeKind.function,
      name,
      signatures: []
    }

    if (TypeGuards.isPropertySignature(node)) {
      const typeNode = node.getTypeNodeOrThrow() as FunctionTypeNode
      functionDoc.signatures.push(convertFunctionTypeNode(typeNode))
    } else {
      functionDoc.signatures.push(convertFunctionDeclaration(node))
    }

    if (!doc.methods.includes(functionDoc)) doc.methods.push(functionDoc)
  }

  return doc
}
