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
  SimpleTypeDocNode
} from '../schema'

import * as ts from 'typescript'

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
  return '' // Never
}

export type Name = ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.ComputedPropertyName | ts.QualifiedName | ts.BindingPattern

export function resolveName (name?: Name): string {
  // Should never happen.
  if (!name) throw new Error('Node does not have a name.')
  // Not sure when this happens yet.
  if (ts.isComputedPropertyName(name)) throw new Error('Unable to resolve computed names.')
  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) throw new Error('Unable to resolve this.')
  if (ts.isQualifiedName(name)) return resolveName(name.left) + '.' + name.right.text

  return name.text
}

export function resolveExpression (node: ts.Expression | undefined): string {
  if (!node) return ''
  // Resolve string literals with the text to handle backslashes
  if (ts.isStringLiteral(node)) {
    return node.text
  }
  return node.getText()
}
