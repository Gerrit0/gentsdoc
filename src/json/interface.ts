import { InterfaceDocNode, DocNodeKind } from '../schema'
import { partial, flatMap } from 'lodash'
import { Symbol, TypeGuards, MethodSignature, PropertySignature, FunctionTypeNode } from 'ts-simple-ast'
import { getCommentFromSymbol, getCommentFromNode } from '../helpers'
import { convertTypeParameter, convertFunctionDeclaration, convertParameter } from './function'
import { convertType } from './type'
import { convertProperty } from './property'

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
    doc.genericTypes = int.getTypeParameters().map(partial(convertTypeParameter, int))
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

      functionDoc.signatures.push({
        name,
        kind: DocNodeKind.functionSignature,
        jsdoc: getCommentFromNode(node),
        genericTypes: typeNode.getTypeParameters().map(param => convertTypeParameter(node, param)),
        parameters: typeNode.getParameters().map((param, index) => convertParameter(node, param, index)),
        returnType: convertType(typeNode.getReturnType(), typeNode.getReturnTypeNode())
      })
    } else {
      functionDoc.signatures.push(convertFunctionDeclaration(node))
    }

    if (!doc.methods.includes(functionDoc)) doc.methods.push(functionDoc)
  }

  return doc
}
