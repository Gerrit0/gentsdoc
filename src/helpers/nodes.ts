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
  SourceDescription
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

export type Name = ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.ComputedPropertyName | ts.QualifiedName

export function resolveName (name?: Name): string {
  // Should never happen.
  if (!name) throw new Error('Node does not have a name.')
  // Not sure when this happens yet.
  if (ts.isComputedPropertyName(name)) throw new Error('Unable to resolve computed names.')
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

export function getNodeSource (node: ts.Node, file: ts.SourceFile): SourceDescription {
  const { line, character } = file.getLineAndCharacterOfPosition(node.getStart())
  return {
    file: file.fileName,
    line,
    character
  }
}
