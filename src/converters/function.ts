import { FunctionDocNode, FunctionSignatureDocNode, DocNodeKind, TypeDocNode, SimpleTypeDocNode } from '../schema'
import * as ts from 'typescript'
import { toArray, partial, unary } from 'lodash'
import { getCommentFromNode, getParamComment, resolveName, isBindingPattern, getVisibility } from '../helpers'
import { convertType, stringifyTypeNode } from './type'
import { Context } from './common'

export function convertFunction ({ symbol }: Context): FunctionDocNode {
  const doc: FunctionDocNode = {
    name: symbol.name,
    kind: DocNodeKind.function,
    signatures: []
  }

  doc.signatures = toArray(symbol.declarations)
    .filter(ts.isFunctionDeclaration)
    .map(unary(convertSignature))

  toArray(symbol.declarations)
    .filter(ts.isVariableDeclaration)
    .forEach(declaration => {
      if (declaration.type && ts.isFunctionTypeNode(declaration.type)) {
        doc.signatures.push(convertSignature(declaration.type, declaration))
      }
    })

  return doc
}

export type Signature = ts.FunctionDeclaration | ts.MethodDeclaration | ts.MethodSignature | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration | ts.ConstructorDeclaration | ts.FunctionTypeNode

export function convertSignature (
  node: Signature | ts.PropertySignature | ts.PropertyDeclaration,
  commentNode: ts.Node = node
): FunctionSignatureDocNode {
  const jsdoc = getCommentFromNode(commentNode)

  let fn: Signature
  if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
    if (node.type && ts.isFunctionTypeNode(node.type)) {
      fn = node.type
    } else {
      throw new Error('Tried to get the signature of an invalid node type.')
    }
  } else {
    fn = node
  }

  const returnTag = jsdoc.tags.find(tag => ['return', 'returns'].includes(tag.tagName))
  // Only get the comment for the root for complex return types
  const getReturnComment = (s: string) => s ? '' :
    returnTag ? returnTag.comment : ''
  const returnType = convertType(
    fn.type,
    getReturnComment
  )

  const doc: FunctionSignatureDocNode = {
    name: node.name ? resolveName(node.name) : '__unknown',
    jsdoc,
    kind: DocNodeKind.functionSignature,
    genericTypes: toArray(fn.typeParameters).map(partial(convertTypeParameter, commentNode)),
    parameters: fn.parameters.map(partial(convertParameter, commentNode)),
    returnType
  }

  // Don't include visibility if it is guaranteed to be public
  if (!ts.isFunctionDeclaration(node) && !ts.isFunctionTypeNode(node)) {
    doc.visibility = getVisibility(node.modifiers)
  }

  return doc
}

export function convertTypeParameter (
  commentNode: ts.Node, param: ts.TypeParameterDeclaration
): SimpleTypeDocNode {
  const name = resolveName(param.name)
  const extendsType = param.constraint ? stringifyTypeNode(param.constraint) : undefined
  const initializer = param.default ? stringifyTypeNode(param.default) : undefined

  return {
    name,
    kind: DocNodeKind.simpleType,
    type: name, // This defines a new type
    comment: getParamComment(commentNode, name),
    optional: !!param.default,
    extends: extendsType,
    initializer
  }
}

export function convertParameter (
  commentNode: ts.Node, param: ts.ParameterDeclaration, index: number
): TypeDocNode {
  const paramName = isBindingPattern(param.name) ? `param${index}` : resolveName(param.name)

  const doc = convertType(param.type, getParamComment(commentNode), paramName)
  doc.optional = !!param.questionToken
  if (param.dotDotDotToken) doc.rest = true

  return doc
}