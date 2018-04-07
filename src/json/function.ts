import {
  CallSignatureDeclaration,
  ConstructSignatureDeclaration,
  ConstructorDeclaration,
  FunctionDeclaration,
  FunctionTypeNode,
  JSDocableNode,
  MethodSignature,
  ParameterDeclaration,
  Symbol,
  TypeGuards,
  TypeParameterDeclaration,
  ts,
  MethodDeclaration
} from 'ts-simple-ast'
import { getCommentFromNode, getParamComment, getReturnComment, getJSDocableNode } from '../helpers'
import { DocNodeKind, FunctionDocNode, FunctionSignatureDocNode, SimpleTypeDocNode, TypeDocNode } from './schema'
import { convertType } from './type'

export function convertFunction (node: Symbol): FunctionDocNode {
  const declarations = node.getDeclarations()
    .filter(TypeGuards.isFunctionDeclaration)
  const varDeclarations = node.getDeclarations()
    .filter(TypeGuards.isVariableDeclaration)

  const signatures = [
    ...declarations.map(convertFunctionDeclaration),
    ...varDeclarations.map(d => d.getTypeNodeOrThrow())
      .filter(TypeGuards.isFunctionTypeNode)
      .map(convertFunctionTypeNode)
  ]

  return {
    name: node.getName(),
    kind: DocNodeKind.function,
    signatures
  }
}

// Todo, there's probably some base type that can be used here.
export function convertFunctionDeclaration (
  declaration: FunctionDeclaration | MethodSignature | MethodDeclaration | CallSignatureDeclaration | ConstructSignatureDeclaration | ConstructorDeclaration
): FunctionSignatureDocNode {
  const returnType = convertType(declaration.getReturnType(), declaration.getReturnTypeNode())
  returnType.comment = getReturnComment(declaration)

  const name = TypeGuards.hasName(declaration) ?
    declaration.getName() : '__unknown'

  return {
    name: name,
    kind: DocNodeKind.functionSignature,
    jsdoc: getCommentFromNode(declaration),
    parameters: declaration.getParameters().map((param, index) => convertParameter(declaration, param, index)),
    genericTypes: declaration.getTypeParameters().map(param => convertTypeParameter(declaration, param)),
    returnType
  }
}

export function convertFunctionTypeNode (typeNode: FunctionTypeNode): FunctionSignatureDocNode {
  let parent = getJSDocableNode(typeNode)

  const name = TypeGuards.hasName(parent) ? parent.getName() : '__unknown'

  return {
    name,
    kind: DocNodeKind.functionSignature,
    jsdoc: getCommentFromNode(parent),
    genericTypes: typeNode.getTypeParameters().map(param => convertTypeParameter(parent, param)),
    parameters: typeNode.getParameters().map((param, index) => convertParameter(parent, param, index)),
    returnType: convertType(typeNode.getReturnType(), typeNode.getReturnTypeNode())
  }
}

export function convertParameter (commentNode: JSDocableNode, param: ParameterDeclaration, index: number): TypeDocNode {
  const name = ts.isIdentifier(param.compilerNode.name) ? param.getName() : `param${index}`

  const doc = convertType(param.getType(), param.getTypeNode() , getParamComment(commentNode), name)
  doc.optional = param.isOptional()
  if (param.isRestParameter()) doc.rest = true

  return doc
}

export function convertTypeParameter (commentNode: JSDocableNode, param: TypeParameterDeclaration): SimpleTypeDocNode {
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
