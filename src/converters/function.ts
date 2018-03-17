import { FunctionDocNode, DocNodeKind, FunctionSignatureDocNode, TypeDocNode } from '../schema'
import { partial } from 'lodash'
import { Symbol, FunctionDeclaration, ParameterDeclaration, JSDocableNode } from 'ts-simple-ast'
import { getCommentFromNode, isBindingPattern, getParamComment, getReturnComment } from '../helpers'
import { convertType } from './type'

export function convertFunction (node: Symbol): FunctionDocNode {
  const declarations = node.getDeclarations().filter(d => d instanceof FunctionDeclaration) as FunctionDeclaration[]

  return {
    name: node.getName(),
    kind: DocNodeKind.function,
    signatures: declarations.map(convertFunctionDeclaration)
  }
}

function convertFunctionDeclaration (declaration: FunctionDeclaration): FunctionSignatureDocNode {
  const returnType = convertType(declaration.getReturnType())
  returnType.comment = getReturnComment(declaration)

  return {
    name: declaration.getName(),
    kind: DocNodeKind.functionSignature,
    jsdoc: getCommentFromNode(declaration),
    parameters: declaration.getParameters().map(partial(convertParameter, declaration)),
    genericTypes: [],
    returnType
  }
}

function convertParameter (commentNode: JSDocableNode, param: ParameterDeclaration, index: number): TypeDocNode {
  const name = isBindingPattern(param.compilerNode.name) ? `param${index}` : param.getName()

  const doc = convertType(param.getType(), param.getTypeNode() , getParamComment(commentNode), name)
  doc.optional = param.isOptional()
  if (param.isRestParameter()) doc.rest = true

  return doc
}

// export function convertParameter (
//   commentNode: ts.Node, param: ts.ParameterDeclaration, index: number
// ): TypeDocNode {
//   const paramName = isBindingPattern(param.name) ? `param${index}` : resolveName(param.name)

//   const doc = convertType(param.type, getParamComment(commentNode), paramName)
//   doc.optional = !!param.questionToken
//   if (param.dotDotDotToken) doc.rest = true

//   return doc
// }

// export type Signature = ts.FunctionDeclaration | ts.MethodDeclaration | ts.MethodSignature | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration | ts.ConstructorDeclaration | ts.FunctionTypeNode

// export function convertSignature (
//   node: Signature | ts.PropertySignature | ts.PropertyDeclaration,
//   commentNode: ts.Node = node
// ): FunctionSignatureDocNode {
//   const jsdoc = getCommentFromNode(commentNode)

//   let fn: Signature
//   if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
//     if (node.type && ts.isFunctionTypeNode(node.type)) {
//       fn = node.type
//     } else {
//       throw new Error('Tried to get the signature of an invalid node type.')
//     }
//   } else {
//     fn = node
//   }

//   const returnTag = jsdoc.tags.find(tag => ['return', 'returns'].includes(tag.tagName))
//   // Only get the comment for the root for complex return types
//   const getReturnComment = (s: string) => s ? '' :
//     returnTag ? returnTag.comment : ''
//   const returnType = convertType(
//     fn.type,
//     getReturnComment
//   )

//   const doc: FunctionSignatureDocNode = {
//     name: node.name ? resolveName(node.name) : '__unknown',
//     jsdoc,
//     kind: DocNodeKind.functionSignature,
//     genericTypes: toArray(fn.typeParameters).map(partial(convertTypeParameter, commentNode)),
//     parameters: fn.parameters.map(partial(convertParameter, commentNode)),
//     returnType
//   }

//   // Don't include visibility if it is guaranteed to be public
//   if (!ts.isFunctionDeclaration(node) && !ts.isFunctionTypeNode(node)) {
//     doc.visibility = getVisibility(node.modifiers)
//   }

//   return doc
// }

// export function convertTypeParameter (
//   commentNode: ts.Node, param: ts.TypeParameterDeclaration
// ): SimpleTypeDocNode {
//   const name = resolveName(param.name)
//   const extendsType = param.constraint ? stringifyTypeNode(param.constraint) : undefined
//   const initializer = param.default ? stringifyTypeNode(param.default) : undefined

//   return {
//     name,
//     kind: DocNodeKind.simpleType,
//     type: name, // This defines a new type
//     comment: getParamComment(commentNode, name),
//     optional: !!param.default,
//     extends: extendsType,
//     initializer
//   }
// }
