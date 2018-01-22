import { FunctionDocNode, FunctionSignatureDocNode, DocNodeKind, TypeDocNode, SimpleTypeDocNode } from '../schema'
import * as ts from 'typescript'
import { toArray, partial } from 'lodash'
import { warn, getCommentFromNode, getParamComment, resolveName, isBindingPattern } from '../helpers'
import { convertType, stringifyTypeNode } from './type'

export function convertFunction (
  symbol: ts.Symbol, checker: ts.TypeChecker
): FunctionDocNode {
  const doc: FunctionDocNode = {
    name: symbol.name,
    kind: DocNodeKind.function,
    signatures: []
  }

  toArray(symbol.declarations)
    .filter(ts.isFunctionDeclaration)
    .forEach(declaration => {
      const signature = checker.getSignatureFromDeclaration(declaration)
      if (!signature) {
        warn('Failed to get signature')
        return
      }

      doc.signatures.push(convertSignature(declaration))
    })

  return doc
}

export function convertSignature (
  signature: ts.FunctionDeclaration | ts.MethodDeclaration | ts.MethodSignature | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration
): FunctionSignatureDocNode {
  const jsdoc = getCommentFromNode(signature)

  const returnTag = jsdoc.tags.find(tag => ['return', 'returns'].includes(tag.tagName))
  // Only get the comment for the root for complex return types
  const getReturnComment = (s: string) => s ? '' :
    returnTag ? returnTag.comment : ''
  const returnType = convertType(
    signature.type,
    getReturnComment
  )

  return {
    name: signature.name ? resolveName(signature.name) : '__unknown',
    jsdoc: {
      ...jsdoc,
      tags: jsdoc.tags.filter(tag => tag.tagName !== 'param')
    },
    kind: DocNodeKind.functionSignature,
    genericTypes: toArray(signature.typeParameters).map(partial(convertTypeParameter, signature)),
    parameters: signature.parameters.map(partial(convertParameter, signature)),
    returnType
  }
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
    comment: getParamComment(commentNode, resolveName(param.name)),
    optional: !!param.default,
    extends: extendsType,
    initializer
  }
}

export function convertParameter (
  commentNode: ts.Node, param: ts.ParameterDeclaration, index: number
): TypeDocNode {
  const paramName = isBindingPattern(param.name) ? `param${index}` : resolveName(param.name)

  const doc = convertType(param.type, partial(getParamComment, commentNode), paramName)
  doc.optional = !!param.questionToken
  if (param.dotDotDotToken) doc.rest = true

  return doc
}
