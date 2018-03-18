import { FunctionDocNode, DocNodeKind, FunctionSignatureDocNode, TypeDocNode, SimpleTypeDocNode } from '../schema'
import { partial } from 'lodash'
import { Symbol, FunctionDeclaration, ParameterDeclaration, JSDocableNode, TypeParameterDeclaration, TypeGuards } from 'ts-simple-ast'
import { getCommentFromNode, isBindingPattern, getParamComment, getReturnComment } from '../helpers'
import { convertType } from './type'

export function convertFunction (node: Symbol): FunctionDocNode {
  const declarations = node.getDeclarations().filter(TypeGuards.isFunctionDeclaration)

  return {
    name: node.getName(),
    kind: DocNodeKind.function,
    signatures: declarations.map(convertFunctionDeclaration)
  }
}

function convertFunctionDeclaration (declaration: FunctionDeclaration): FunctionSignatureDocNode {
  const returnType = convertType(declaration.getReturnType(), declaration.getReturnTypeNode())
  returnType.comment = getReturnComment(declaration)

  return {
    name: declaration.getName(),
    kind: DocNodeKind.functionSignature,
    jsdoc: getCommentFromNode(declaration),
    parameters: declaration.getParameters().map(partial(convertParameter, declaration)),
    genericTypes: declaration.getTypeParameters().map(partial(convertTypeParameter, declaration)),
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

function convertTypeParameter (commentNode: JSDocableNode, param: TypeParameterDeclaration): SimpleTypeDocNode {
  const name = param.getName()
  let extendsType: string | undefined
  const constraint = param.getConstraintNode()
  if (constraint) {
    extendsType = constraint.getText()
  }
  const initializer = param.compilerNode.default ? param.compilerNode.default.getText() : undefined

  return {
    name: name,
    kind: DocNodeKind.simpleType,
    type: name,
    comment: getParamComment(commentNode, name),
    optional: !!param.getDefaultNode(),
    extends: extendsType,
    initializer
  }
}
