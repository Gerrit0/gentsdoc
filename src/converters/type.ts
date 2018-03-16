// import { TypeDocNode, SimpleTypeDocNode, DocNodeKind, ObjectTypeDocNode, FunctionTypeDocNode } from '../schema'
// import * as ts from 'typescript'
// import { last } from 'lodash'
// import { resolveName } from '../helpers'

// /**
//  * Not provided by Typescript.
//  * @param node the node to check
//  */
// const isKeywordTypeNode = (node: ts.Node): node is ts.KeywordTypeNode => [
//   ts.SyntaxKind.AnyKeyword,
//   ts.SyntaxKind.NumberKeyword,
//   ts.SyntaxKind.ObjectKeyword,
//   ts.SyntaxKind.BooleanKeyword,
//   ts.SyntaxKind.StringKeyword,
//   ts.SyntaxKind.SymbolKeyword,
//   ts.SyntaxKind.ThisKeyword,
//   ts.SyntaxKind.VoidKeyword,
//   ts.SyntaxKind.UndefinedKeyword,
//   ts.SyntaxKind.NullKeyword,
//   ts.SyntaxKind.NeverKeyword
// ].includes(node.kind)

// const keywordTypeMap = new Map<ts.SyntaxKind, string>([
//   [ts.SyntaxKind.AnyKeyword, 'any'],
//   [ts.SyntaxKind.NumberKeyword, 'number'],
//   [ts.SyntaxKind.ObjectKeyword, 'Object'],
//   [ts.SyntaxKind.BooleanKeyword, 'boolean'],
//   [ts.SyntaxKind.StringKeyword, 'string'],
//   [ts.SyntaxKind.SymbolKeyword, 'Symbol'],
//   [ts.SyntaxKind.ThisKeyword, 'this'],
//   [ts.SyntaxKind.VoidKeyword, 'void'],
//   [ts.SyntaxKind.UndefinedKeyword, 'undefined'],
//   [ts.SyntaxKind.NullKeyword, 'null'],
//   [ts.SyntaxKind.NeverKeyword, 'never']
// ])

// interface Context {
//   getComment: (name: string[]) => string
//   nameScope: string[]
// }

// /**
//  * Since we only care if the questionToken property exists, cast to any.
//  * @param node the node to test
//  */
// const hasQuestionToken = (node: any): boolean => !!node.questionToken
// /**
//  * Since we only care if the questionToken property exists, cast to any.
//  * @param node the node to test
//  */
// const hasRestToken = (node: ts.Node): boolean => !!(node as any).dotDotDotToken

// function getBaseTypeNode (node: ts.TypeNode, { nameScope, getComment }: Context): TypeDocNode {
//   const doc: TypeDocNode = {
//     kind: DocNodeKind.type,
//     name: last(nameScope) || '__unknown',
//     comment: getComment(nameScope),
//     optional: hasQuestionToken(node)
//   }

//   if (hasRestToken(node)) doc.rest = true

//   return doc
// }

// export function convertSimpleTypeNode (node: ts.TypeNode, context: Context): SimpleTypeDocNode {
//   return {
//     ...getBaseTypeNode(node, context),
//     kind: DocNodeKind.simpleType,
//     type: stringifyTypeNode(node)
//   }
// }

// export function convertTypeLiteralTypeNode (node: ts.TypeLiteralNode, context: Context): ObjectTypeDocNode {
//   return {
//     ...getBaseTypeNode(node, context),
//     kind: DocNodeKind.objectType,
//     members: node.members
//       .filter(ts.isPropertySignature)
//       .map(member => {
//         const memberDoc = convertTypeInternal(member.type, {
//           ...context,
//           nameScope: [...context.nameScope, member.name.getText()]
//         })
//         memberDoc.optional = hasQuestionToken(member)
//         return memberDoc
//       })
//   }
// }

// export function convertTupleTypeNode (node: ts.TupleTypeNode, context: Context): ObjectTypeDocNode {
//   return {
//     ...getBaseTypeNode(node, context),
//     kind: DocNodeKind.objectType,
//     members: node.elementTypes.map((type, index) => convertTypeInternal(type, {
//       ...context,
//       nameScope: [...context.nameScope, index.toString()]
//     }))
//   }
// }

// function convertFunctionTypeNode (node: ts.FunctionTypeNode, context: Context): FunctionTypeDocNode {
//   return {
//     ...getBaseTypeNode(node, context),
//     kind: DocNodeKind.functionTypeDocNode,
//     genericTypes: [],
//     parameters: node.parameters.map(param => convertParameterDeclaration(param, context)),
//     returnType: convertTypeInternal(node.type, context)
//   }
// }

// function convertParameterDeclaration (param: ts.ParameterDeclaration, context: Context): TypeDocNode {
//   const paramName = resolveName(param.name).replace(/^__(\d+)$/, 'param$1')
//   const doc = convertTypeInternal(param.type, {
//     ...context,
//     nameScope: [ ...context.nameScope, paramName ]
//   })
//   doc.optional = !!param.questionToken
//   if (param.dotDotDotToken) doc.rest = true

//   return doc
// }

// export function stringifyTypeNode (node: ts.TypeNode): string {
//   if (ts.isUnionTypeNode(node)) {
//     return node.types.map(stringifyTypeNode).join(' | ')
//   }
//   if (ts.isIntersectionTypeNode(node)) {
//     return node.types.map(stringifyTypeNode).join(' & ')
//   }
//   if (isKeywordTypeNode(node)) {
//     return keywordTypeMap.get(node.kind)!
//   }
//   if (ts.isLiteralTypeNode(node)) {
//     switch (node.literal.kind) {
//       case ts.SyntaxKind.NumericLiteral: return 'number'
//       case ts.SyntaxKind.StringLiteral: return 'string'
//       default:
//         throw new Error('Unknown literal type node kind.')
//     }
//   }
//   if (ts.isTypeReferenceNode(node)) {
//     return resolveName(node.typeName)
//   }
//   if (ts.isArrayTypeNode(node)) {
//     return `Array<${stringifyTypeNode(node.elementType)}>`
//   }
//   return node.getText()
// }

// function convertTypeInternal (node: ts.TypeNode | undefined, context: Context): TypeDocNode {
//   if (!node) {
//     return convertSimpleTypeNode(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword), { ...context })
//   }

//   if ([
//     isKeywordTypeNode,
//     ts.isIntersectionTypeNode,
//     ts.isUnionTypeNode,
//     ts.isLiteralTypeNode
//   ].some(test => test(node))) {
//     return convertSimpleTypeNode(node as ts.TypeNode, { ...context })
//   }
//   if (ts.isTypeLiteralNode(node)) {
//     return convertTypeLiteralTypeNode(node, { ...context })
//   }
//   if (ts.isTupleTypeNode(node)) {
//     return convertTupleTypeNode(node, { ...context })
//   }
//   if (ts.isFunctionTypeNode(node)) {
//     return convertFunctionTypeNode(node, { ...context })
//   }
//   return convertSimpleTypeNode(node, { ...context })
// }

// export function convertType (node: ts.TypeNode | undefined, getComment: (name: string) => string = () => '', name?: string): TypeDocNode {
//   const context: Context = {
//     nameScope: name ? [name] : [],
//     getComment: (scope: string[]) => getComment(scope.join('.'))
//   }

//   return convertTypeInternal(node, context)
// }
