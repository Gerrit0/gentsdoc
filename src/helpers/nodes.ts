import {
  DocNode,
  FileDocNode,
  VariableDocNode,
  TypeAliasDocNode,
  InterfaceDocNode,
  EnumDocNode,
  ClassDocNode,
  FunctionDocNode,

  DocNodeKind,
  TypeDocNode,
  TupleTypeDocNode,
  ObjectTypeDocNode,
  SimpleTypeDocNode,
  FunctionTypeDocNode,
  DocNodeVisibility
} from '../schema'

import { Node, SyntaxKind } from 'ts-simple-ast'

export const isFileDocNode = (node: DocNode): node is FileDocNode => node.kind === DocNodeKind.file

export const isVariableDocNode = (node: DocNode): node is VariableDocNode => node.kind === DocNodeKind.variable

export const isTypeAliasDocNode = (node: DocNode): node is TypeAliasDocNode => node.kind === DocNodeKind.typeAlias

export const isInterfaceDocNode = (node: DocNode): node is InterfaceDocNode => node.kind === DocNodeKind.typeInterface

export const isEnumDocNode = (node: DocNode): node is EnumDocNode => node.kind === DocNodeKind.enum

export const isClassDocNode = (node: DocNode): node is ClassDocNode => node.kind === DocNodeKind.class

export const isFunctionDocNode = (node: DocNode): node is FunctionDocNode => node.kind === DocNodeKind.function

export const isTypeDocNode = (node: DocNode): node is TypeDocNode => (node.kind & DocNodeKind.type) !== 0

export const isTupleTypeDocNode = (node: DocNode): node is TupleTypeDocNode => node.kind === DocNodeKind.tupleType

export const isObjectTypeDocNode = (node: DocNode): node is ObjectTypeDocNode => node.kind === DocNodeKind.objectType

export const isFunctionTypeDocNode = (node: DocNode): node is FunctionTypeDocNode => node.kind === DocNodeKind.functionTypeDocNode

export const isSimpleTypeDocNode = (node: DocNode): node is SimpleTypeDocNode => node.kind === DocNodeKind.simpleType

export function stringifyType (node: TypeDocNode): string {
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

export function getVisibility (modifiers: Node[]): DocNodeVisibility {
  for (const kind of modifiers.map(mod => mod.getKind())) {
    switch (kind) {
      case SyntaxKind.PrivateKeyword: return 'private'
      case SyntaxKind.ProtectedKeyword: return 'protected'
      case SyntaxKind.PublicKeyword: return 'public'
    }
  }
  return 'public'
}
