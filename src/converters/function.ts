import { FunctionDocNode, FunctionSignatureDocNode, DocNodeKind, TypeDocNode } from '../schema'
import * as ts from 'typescript'
import { toArray, partial } from 'lodash'
import { warn, getCommentFromNode, getParamComment } from '../index'
import { convertType } from './type'

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

      doc.signatures.push(convertSignature(signature, declaration, checker))
    })

  return doc
}

function convertSignature (
  signature: ts.Signature, declaration: ts.FunctionDeclaration, checker: ts.TypeChecker
): FunctionSignatureDocNode {

  const jsdoc = getCommentFromNode(declaration)

  // Return type
  const returnTypeNode = checker.typeToTypeNode(signature.getReturnType(), declaration)
  const returnTag = jsdoc.tags.find(tag => ['return', 'returns'].includes(tag.tagName))
  // Only get the comment for the root for complex return types
  const getReturnComment = (s: string) => s ? '' :
    returnTag ? returnTag.comment : ''
  const returnType = convertType(returnTypeNode, getReturnComment)

  return {
    name: declaration.name ? declaration.name.text : '__unknown',
    jsdoc: {
      ...jsdoc,
      tags: jsdoc.tags.filter(tag => tag.tagName !== 'param')
    },
    kind: DocNodeKind.functionSignature,
    genericTypes: [],
    parameters: signature.getParameters().map(partial(convertParameter, declaration)),
    returnType
  }
}

function convertParameter (
  commentNode: ts.Node, param: ts.Symbol
): TypeDocNode {
  const declaration = param.valueDeclaration
  if (!declaration || !ts.isParameter(declaration)) {
    // Should never happen
    throw new Error('Missing parameter declaration')
  }

  const paramName = /^__\d+$/.test(param.name) ? param.name.replace('__', 'param') : param.name
  const typeNode = declaration.type ? declaration.type : ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)

  const doc = convertType(typeNode, partial(getParamComment, commentNode), paramName)
  doc.optional = !!declaration.questionToken
  if (declaration.dotDotDotToken) doc.rest = true

  return doc
}
