import { TypeDocNode, SimpleTypeDocNode, DocNodeKind, ObjectTypeDocNode } from '../schema'
import * as ts from 'typescript'
import { last } from 'lodash'
import { resolveName } from '../index'

/**
 * Not provided by Typescript.
 * @param node the node to check
 */
const isKeywordTypeNode = (node: ts.Node): node is ts.KeywordTypeNode => [
  ts.SyntaxKind.AnyKeyword,
  ts.SyntaxKind.NumberKeyword,
  ts.SyntaxKind.ObjectKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.SymbolKeyword,
  ts.SyntaxKind.ThisKeyword,
  ts.SyntaxKind.VoidKeyword,
  ts.SyntaxKind.UndefinedKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.NeverKeyword
].includes(node.kind)

const keywordTypeMap = new Map<ts.SyntaxKind, string>([
  [ts.SyntaxKind.AnyKeyword, 'any'],
  [ts.SyntaxKind.NumberKeyword, 'number'],
  [ts.SyntaxKind.ObjectKeyword, 'Object'],
  [ts.SyntaxKind.BooleanKeyword, 'boolean'],
  [ts.SyntaxKind.StringKeyword, 'string'],
  [ts.SyntaxKind.SymbolKeyword, 'Symbol'],
  [ts.SyntaxKind.ThisKeyword, 'this'],
  [ts.SyntaxKind.VoidKeyword, 'void'],
  [ts.SyntaxKind.UndefinedKeyword, 'undefined'],
  [ts.SyntaxKind.NullKeyword, 'null'],
  [ts.SyntaxKind.NeverKeyword, 'never']
])

interface Context {
  getComment: (name: string[]) => string
  nameScope: string[]
}

/**
 * Since we only care if the questionToken property exists, cast to any.
 * @param node the node to test
 */
const hasQuestionToken = <T extends ts.Node>(node: T): boolean => !!(node as any).questionToken
/**
 * Since we only care if the questionToken property exists, cast to any.
 * @param node the node to test
 */
const hasRestToken = <T extends ts.Node>(node: T): boolean => !!(node as any).dotDotDotToken

function getBaseTypeNode (node: ts.TypeNode, { nameScope, getComment }: Context): TypeDocNode {
  const doc: TypeDocNode = {
    kind: DocNodeKind.type,
    name: last(nameScope) || '__unknown',
    comment: getComment(nameScope),
    optional: hasQuestionToken(node)
  }

  if (hasRestToken(node)) doc.rest = true

  return doc
}

export function convertSimpleTypeNode (node: ts.TypeNode, context: Context): SimpleTypeDocNode {
  return {
    ...getBaseTypeNode(node, context),
    kind: DocNodeKind.simpleType,
    type: stringifyTypeNode(node)
  }
}

export function convertTypeLiteralTypeNode (node: ts.TypeLiteralNode, context: Context): ObjectTypeDocNode {
  return {
    ...getBaseTypeNode(node, context),
    kind: DocNodeKind.objectType,
    members: node.members
      .filter(ts.isPropertySignature)
      .map(member => {
        const type = member.type ? member.type : ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        return convertTypeInternal(type, {
          ...context,
          nameScope: [...context.nameScope, member.name.getText()]
        })
      })
  }
}

export function convertTupleTypeNode (node: ts.TupleTypeNode, context: Context): ObjectTypeDocNode {
  return {
    ...getBaseTypeNode(node, context),
    kind: DocNodeKind.objectType,
    members: node.elementTypes.map((type, index) => convertTypeInternal(type, {
      ...context,
      nameScope: [...context.nameScope, index.toString()]
    }))
  }
}

function stringifyTypeNode (node: ts.TypeNode): string {
  if (ts.isUnionTypeNode(node)) {
    return node.types.map(stringifyTypeNode).join(' | ')
  }
  if (ts.isIntersectionTypeNode(node)) {
    return node.types.map(stringifyTypeNode).join(' & ')
  }
  if (isKeywordTypeNode(node)) {
    return keywordTypeMap.get(node.kind)!
  }
  if (ts.isTypeReferenceNode(node)) {
    return resolveName(node.typeName)
  }
  if (ts.isArrayTypeNode(node)) {
    return `Array<${stringifyTypeNode(node.elementType)}>`
  }
  return node.getText()
}

function convertTypeInternal (node: ts.TypeNode, context: Context): TypeDocNode {

  if ([
    isKeywordTypeNode,
    ts.isIntersectionTypeNode,
    ts.isUnionTypeNode
  ].some(test => test(node))) {
    return convertSimpleTypeNode(node as ts.TypeNode, { ...context })
  }
  if (ts.isTypeLiteralNode(node)) {
    return convertTypeLiteralTypeNode(node, { ...context })
  }
  if (ts.isTupleTypeNode(node)) {
    return convertTupleTypeNode(node, { ...context })
  }
  return convertSimpleTypeNode(node, { ...context })
}

export function convertType (node: ts.TypeNode, getComment: (name: string) => string, name?: string): TypeDocNode {
  const context: Context = {
    nameScope: name ? [name] : [],
    getComment: (scope: string[]) => getComment(scope.join('.'))
  }

  return convertTypeInternal(node, context)
}
