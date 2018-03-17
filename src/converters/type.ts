import { TypeDocNode, SimpleTypeDocNode, DocNodeKind, ObjectTypeDocNode, TupleTypeDocNode } from '../schema'
import { last } from 'lodash'
import { Type, Node, ts, TypeNode, TypeGuards } from 'ts-simple-ast'

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
    return convertSimpleType(type, context)
  }

  if (type.isObjectType() && type.isAnonymousType()) {
    return convertObjectType(type, context)
  }

  if (type.isTupleType()) {
    return convertTupleType(type, context)
  }

  return convertSimpleType(type, context)
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

function convertSimpleType (type: Type, context: Context): SimpleTypeDocNode {
  return {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.simpleType,
    type: type.getText()
  }
}

function convertObjectType (type: Type, context: Context): ObjectTypeDocNode {
  return {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.objectType,
    members: type.getProperties().map(symbol => {
      const property = symbol.getValueDeclarationOrThrow() as Node<ts.PropertyDeclaration>
      const memberDoc = convertTypeInternal(property.getType(), {
        ...context,
        nameScope: [...context.nameScope, symbol.getName()]
      })
      memberDoc.optional = !!property.compilerNode.questionToken

      return memberDoc
    })
  }
}

function convertTupleType (type: Type, context: Context): TupleTypeDocNode {
  return {
    ...getBaseTypeNode(type, context),
    kind: DocNodeKind.tupleType,
    members: type.getTupleElements().map((elementType, index) => convertTypeInternal(elementType, {
      ...context,
      nameScope: [...context.nameScope, index.toString()]
    }))
  }
}

// function convertFunctionType (type: Type, context: Context): FunctionTypeDocNode {
//   return {
//     ...getBaseTypeNode(type, context),
//     kind: DocNodeKind.functionTypeDocNode,
//     genericTypes: [],
//     parameters: [],
//     returnType: '' as any
//   }
// }
