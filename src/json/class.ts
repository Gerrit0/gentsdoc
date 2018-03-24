// import { ClassDocNode, DocNodeKind, FunctionDocNode, SimpleTypeDocNode } from '../schema'
// import * as ts from 'typescript'
// import { getCommentFromSymbol, resolveName, warn, resolveExpression } from '../helpers'
// import { toArray, partial } from 'lodash'
// import { convertTypeParameter, convertSignature } from './function'
// import { convertProperty } from './property'
// import { Context } from './common'

// function isStatic (node: ts.Node) {
//   return toArray(node.modifiers).some(m => m.kind === ts.SyntaxKind.StaticKeyword)
// }

// function isAbstract (node: ts.Node) {
//   return toArray(node.modifiers).some(m => m.kind === ts.SyntaxKind.AbstractKeyword)
// }

// export function convertClass ({ symbol }: Context): ClassDocNode {
//   const declaration = toArray(symbol.declarations).find(ts.isClassDeclaration)
//   if (!declaration) {
//     throw new Error('No class declaration found.')
//   }

//   const doc: ClassDocNode = {
//     kind: DocNodeKind.class,
//     name: symbol.name,
//     implements: [],
//     abstract: toArray(declaration.modifiers).some(m => m.kind === ts.SyntaxKind.AbstractKeyword),
//     jsdoc: getCommentFromSymbol(symbol),
//     genericTypes: [],
//     constructors: [],
//     properties: [],
//     methods: [],
//     staticProperties: [],
//     staticMethods: []
//   }

//   const extendedFrom = toArray(declaration.heritageClauses)
//     .find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword)
//   if (extendedFrom) doc.extends = resolveExpression(extendedFrom.types[0].expression)
//   toArray(declaration.heritageClauses)
//     .filter(clause => clause.token === ts.SyntaxKind.ImplementsKeyword)
//     .forEach(clause => doc.implements.push(resolveExpression(clause.types[0].expression)))

//   doc.genericTypes = toArray(declaration.typeParameters).map(partial(convertTypeParameter, declaration))

//   const ctorReturnType: SimpleTypeDocNode = {
//     kind: DocNodeKind.simpleType,
//     name: '__unknown',
//     comment: '',
//     optional: false,
//     type: doc.name
//   }

//   declaration.members.forEach(member => {
//     if (ts.isConstructorDeclaration(member)) {

//       const ctorDoc = convertSignature(member)
//       doc.constructors.push(ctorDoc)
//       ctorDoc.returnType = Object.assign({}, ctorReturnType)

//     } else if (ts.isMethodDeclaration(member)) {

//       handleFunction(member)

//     } else if (ts.isPropertyDeclaration(member)) {

//       if (member.type && ts.isFunctionTypeNode(member.type)) {
//         handleFunction(member)
//         return
//       }

//       const propertyDoc = convertProperty(member)
//       const holder = isStatic(member) ? doc.staticProperties : doc.properties
//       holder.push(propertyDoc)
//       if (holder === doc.properties && isAbstract(member)) {
//         propertyDoc.abstract = true
//       }

//     } else {
//       warn('Unknown class member type', resolveName(member.name), ts.SyntaxKind[member.kind])
//     }
//   })

//   function handleFunction (node: ts.MethodDeclaration | ts.PropertyDeclaration): void {
//     const holder = isStatic(node) ? doc.staticMethods : doc.methods
//     const name = resolveName(node.name)
//     const memberDoc: FunctionDocNode = holder.find(method => name === method.name) || {
//       kind: DocNodeKind.function,
//       name,
//       signatures: []
//     }

//     const signatureDoc = convertSignature(node)
//     memberDoc.signatures.push(signatureDoc)
//     if (holder === doc.methods && isAbstract(node)) {
//       signatureDoc.abstract = true
//     }

//     if (!holder.includes(memberDoc)) holder.push(memberDoc)
//   }

//   return doc
// }
