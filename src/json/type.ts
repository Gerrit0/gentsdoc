import { TypeDocNode, SimpleTypeDocNode, DocNodeKind, ObjectTypeDocNode, TupleTypeDocNode, FunctionTypeDocNode } from '../schema'
import { last } from 'lodash'
import { Type, Node, ts, TypeNode, TypeGuards, FunctionTypeNode } from 'ts-simple-ast'

export function convertType (type: Type, typeNode?: TypeNode, getComment: (name: string) => string = () => '', name?: string): TypeDocNode {
  const context: Context = {
    nameScope: name ? [name] : [],
    getComment: (scope: string[]) => getComment(scope.join('.'))
  }

  return convertTypeInternal(type, context, typeNode)
}

interface Context {
  getComment: (name: string[]) => string
  nameScope: string[]
}

function convertTypeInternal (type: Type, context: Context, typeNode?: TypeNode): TypeDocNode {
  if (typeNode && TypeGuards.isTypeReferenceNode(typeNode)) {
    return convertSimpleType(type, context, typeNode)
  }

  if (type.isObjectType() && type.isAnonymousType() && type.getProperties().length) {
    return convertObjectType(type, context, typeNode)
  }

  if (type.isTupleType()) {
    return convertTupleType(type, context, typeNode)
  }

  if (typeNode && TypeGuards.isFunctionTypeNode(typeNode)) {
    return convertFunctionType(typeNode, context)
  }

  return convertSimpleType(type, context, typeNode)
}

function getBaseTypeNode (node: Type, { nameScope, getComment }: Context): TypeDocNode {
  const doc: TypeDocNode = {
    kind: DocNodeKind.type,
    name: last(nameScope) || '__unknown',
    comment: getComment(nameScope),
    optional: node.isNullable()
  }

  return doc
}

function convertSimpleType (type: Type, context: Context, typeNode?: TypeNode): SimpleTypeDocNode {
  return {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.simpleType,
    type: typeNode ? typeNode.getText() : type.getText()
  }
}

function convertObjectType (type: Type, context: Context, typeNode?: TypeNode): ObjectTypeDocNode {
  const doc: ObjectTypeDocNode = {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.objectType,
    members: []
  }

  if (typeNode && TypeGuards.isTypeLiteralNode(typeNode)) {
    doc.members = typeNode.getProperties().map(member => {
      const memberDoc = convertTypeInternal(member.getType(), {
        ...context,
        nameScope: [...context.nameScope, member.getName()]
      }, member.getTypeNode())
      memberDoc.optional = !!member.compilerNode.questionToken

      return memberDoc
    })
  } else {
    doc.members = type.getProperties().map(symbol => {
      const property = symbol.getValueDeclarationOrThrow() as Node<ts.PropertyDeclaration>
      const memberDoc = convertTypeInternal(property.getType(), {
        ...context,
        nameScope: [...context.nameScope, symbol.getName()]
      })
      memberDoc.optional = !!property.compilerNode.questionToken

      return memberDoc
    })
  }

  return doc
}

function convertTupleType (type: Type, context: Context, typeNode?: TypeNode): TupleTypeDocNode {
  const doc: TupleTypeDocNode = {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.tupleType,
    members: []
  }

  if (typeNode && TypeGuards.isTupleTypeNode(typeNode)) {
    const elements = type.getTupleElements()
    doc.members = typeNode.getElementTypeNodes().map((typeNode, index) => {
      return convertTypeInternal(elements[index], {
        ...context,
        nameScope: [...context.nameScope, index.toString()]
      }, typeNode)
    })
  } else {
    doc.members = type.getTupleElements().map((elementType, index) => convertTypeInternal(elementType, {
      ...context,
      nameScope: [...context.nameScope, index.toString()]
    }))
  }

  return doc
}

function convertFunctionType (type: FunctionTypeNode, context: Context): FunctionTypeDocNode {
  const genericTypes = type.getTypeParameters().map(t =>
    convertTypeInternal(t.getType(), {
      ...context,
      nameScope: [...context.nameScope, t.getName()]
    })
  )

  const parameters = type.getParameters().map((param, index) => {
    const name = ts.isIdentifier(param.compilerNode.name) ? param.getName()! : index.toString()
    return convertTypeInternal(param.getType(), {
      ...context,
      nameScope: [...context.nameScope, name]
    })
  })

  return {
    ...getBaseTypeNode(type.getType(), context),
    kind: DocNodeKind.functionTypeDocNode,
    genericTypes,
    parameters,
    returnType: convertTypeInternal(type.getReturnType(), { getComment: () => '', nameScope: [] })
  }
}
