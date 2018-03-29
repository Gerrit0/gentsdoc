import { FunctionTypeNode, MethodDeclaration, PropertyDeclaration, Symbol, TypeGuards } from 'ts-simple-ast'
import { getCommentFromSymbol, getVisibility, warn } from '../helpers'
import { ClassDocNode, DocNodeKind, FunctionDocNode, SimpleTypeDocNode } from '../schema'
import { convertFunctionDeclaration, convertFunctionTypeNode, convertTypeParameter } from './function'
import { convertProperty } from './property'

export function convertClass (symbol: Symbol): ClassDocNode {
  const declaration = symbol.getDeclarations().find(TypeGuards.isClassDeclaration)
  if (!declaration) {
    throw new Error('No class declaration found.')
  }

  const doc: ClassDocNode = {
    kind: DocNodeKind.class,
    name: symbol.getName(),
    implements: [],
    abstract: declaration.isAbstract(),
    jsdoc: getCommentFromSymbol(symbol),
    genericTypes: [],
    constructors: [],
    properties: [],
    methods: [],
    staticProperties: [],
    staticMethods: []
  }

  const extendedFrom = declaration.getExtends()
  if (extendedFrom) doc.extends = extendedFrom.getText()
  doc.implements = declaration.getImplements()
    .map(i => i.getText())

  doc.genericTypes = declaration.getTypeParameters().map(param => convertTypeParameter(declaration, param))

  const ctorReturnType: SimpleTypeDocNode = {
    kind: DocNodeKind.simpleType,
    name: '__unknown',
    comment: '',
    optional: false,
    type: doc.name
  }

  declaration.getMembers().forEach(member => {
    if (TypeGuards.isConstructorDeclaration(member)) {

      const ctorDoc = convertFunctionDeclaration(member)
      ctorDoc.visibility = getVisibility(member)
      doc.constructors.push(ctorDoc)
      ctorDoc.returnType = Object.assign({}, ctorReturnType)

    } else if (TypeGuards.isMethodDeclaration(member)) {

      handleFunction(member)

    } else if (TypeGuards.isPropertyDeclaration(member)) {
      const typeNode = member.getTypeNode()
      if (typeNode && TypeGuards.isFunctionTypeNode(typeNode)) {
        handleFunction(member)
        return
      }

      const propertyDoc = convertProperty(member)
      const holder = member.isStatic() ? doc.staticProperties : doc.properties
      holder.push(propertyDoc)
      if (holder === doc.properties && member.isAbstract()) {
        propertyDoc.abstract = true
      }
      propertyDoc.visibility = getVisibility(member)

    } else {
      warn('Unknown class member type', member.getName(), member.getKindName())
    }
  })

  function handleFunction (node: MethodDeclaration | PropertyDeclaration): void {
    const holder = node.isStatic() ? doc.staticMethods : doc.methods
    const name = node.getName()
    const memberDoc: FunctionDocNode = holder.find(method => name === method.name) || {
      kind: DocNodeKind.function,
      name,
      signatures: []
    }

    const signatureDoc = TypeGuards.isPropertyDeclaration(node) ?
        convertFunctionTypeNode(node.getTypeNodeOrThrow() as FunctionTypeNode) : convertFunctionDeclaration(node)
    memberDoc.signatures.push(signatureDoc)
    if (holder === doc.methods && node.isAbstract()) {
      signatureDoc.abstract = true
    }
    signatureDoc.visibility = getVisibility(node)

    if (!holder.includes(memberDoc)) holder.push(memberDoc)
  }

  return doc
}
