import { SyntaxKind, ModifierableNode } from 'ts-simple-ast'
import * as S from '../json/schema'

type DocNode = S.DocNode
const DocNodeKind = S.DocNodeKind

export const isFileDocNode = (node: DocNode): node is S.FileDocNode => node.kind === DocNodeKind.file

export const isVariableDocNode = (node: DocNode): node is S.VariableDocNode => node.kind === DocNodeKind.variable

export const isTypeAliasDocNode = (node: DocNode): node is S.TypeAliasDocNode => node.kind === DocNodeKind.typeAlias

export const isInterfaceDocNode = (node: DocNode): node is S.InterfaceDocNode => node.kind === DocNodeKind.typeInterface

export const isEnumDocNode = (node: DocNode): node is S.EnumDocNode => node.kind === DocNodeKind.enum

export const isClassDocNode = (node: DocNode): node is S.ClassDocNode => node.kind === DocNodeKind.class

export const isFunctionDocNode = (node: DocNode): node is S.FunctionDocNode => node.kind === DocNodeKind.function

export const isFunctionSignatureDocNode = (node: DocNode): node is S.FunctionSignatureDocNode => node.kind === DocNodeKind.functionSignature

export const isTypeDocNode = (node: DocNode): node is S.TypeDocNode => (node.kind & DocNodeKind.type) !== 0

export const isTupleTypeDocNode = (node: DocNode): node is S.TupleTypeDocNode => node.kind === DocNodeKind.tupleType

export const isObjectTypeDocNode = (node: DocNode): node is S.ObjectTypeDocNode => node.kind === DocNodeKind.objectType

export const isFunctionTypeDocNode = (node: DocNode): node is S.FunctionTypeDocNode => node.kind === DocNodeKind.functionTypeDocNode

export const isSimpleTypeDocNode = (node: DocNode): node is S.SimpleTypeDocNode => node.kind === DocNodeKind.simpleType

export function stringifyType (node: S.TypeDocNode): string {
  if (isSimpleTypeDocNode(node)) {
    return node.type
  }
  if (isTupleTypeDocNode(node)) {
    const memberTypes = node.members.map(stringifyType)
    return `[ ${memberTypes.join(', ')} ]`
  }
  if (isObjectTypeDocNode(node)) {
    const memberTypes = node.members.map(member => {
      return `${member.name}: ${stringifyType(member)}`
    })
    return `{ ${memberTypes.join(', ')} }`
  }
  if (isFunctionTypeDocNode(node)) {
    const params = node.parameters.map(param => {
      return `${param.name}: ${stringifyType(param)}`
    })
    const genericTypes = node.genericTypes.map(stringifyType)
    return (genericTypes.length ? `<${genericTypes.join(', ')}>` : '')
      + `(${params.join(', ')}) => ${stringifyType(node.returnType)}`
  }
  return ''
}

export function stringifyFunctionSignature (node: S.FunctionSignatureDocNode): string {
  const params = node.parameters.map(param => `${param.rest ? '...' : ''}${param.name}: ${stringifyType(param)}`)

  const genericTypes = node.genericTypes.map(type => {
    let result = stringifyType(type)
    if (type.extends) result += ' extends ' + type.extends
    if (type.initializer) result += ' = ' + type.initializer
    return result
  })
  return (genericTypes.length ? `<${genericTypes.join(', ')}>` : '')
    + `(${params.join(', ')}) => ${stringifyType(node.returnType)}`
}

export function getVisibility (node: ModifierableNode): S.DocNodeVisibility {
  for (const kind of node.getModifiers().map(mod => mod.getKind())) {
    switch (kind) {
      case SyntaxKind.PrivateKeyword: return 'private'
      case SyntaxKind.ProtectedKeyword: return 'protected'
      case SyntaxKind.PublicKeyword: return 'public'
    }
  }
  return 'public'
}
