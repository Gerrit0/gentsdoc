// import { InterfaceDocNode, DocNodeKind } from '../schema'
// import * as ts from 'typescript'
// import { toArray, partial, flatMap } from 'lodash'
// import { warn, getCommentFromSymbol, isTSNode, resolveName, getCommentFromNode, resolveExpression } from '../helpers'
// import { convertSignature, convertTypeParameter } from './function'
// import { convertType } from './type'
// import { convertProperty } from './property'
// import { Context } from './common'

// export function convertInterface ({ symbol }: Context): InterfaceDocNode {
//   // const int = toArray(symbol.declarations).find(ts.isInterfaceDeclaration)!
//   const doc: InterfaceDocNode = {
//     name: symbol.name,
//     kind: DocNodeKind.typeInterface,
//     jsdoc: getCommentFromSymbol(symbol),
//     genericTypes: [],
//     methods: [],
//     properties: [],
//     signatures: [],
//     indexes: [],
//     constructors: [],
//     extends: []
//   }

//   const int = toArray(symbol.declarations).find(ts.isInterfaceDeclaration)
//   if (int) { // Should always pass
//     doc.genericTypes = toArray(int.typeParameters).map(partial(convertTypeParameter, int))
//     const extendedFrom = toArray(int.heritageClauses)
//       .filter(clause => clause.token === ts.SyntaxKind.ExtendsKeyword)
//     doc.extends = flatMap(extendedFrom, ex => ex.types.map(resolveExpression))
//   }

//   const declarations = toArray(symbol.declarations)
//     .filter(ts.isInterfaceDeclaration)

//   flatMap(declarations, d => toArray(d.members))
//     .filter(isTSNode) // Everything should pass
//     .forEach((node: ts.Node) => {
//       if (ts.isMethodSignature(node)) {
//         resolveMethod(node)

//       } else if (ts.isCallSignatureDeclaration(node)) {
//         doc.signatures.push(convertSignature(node))

//       } else if (ts.isPropertySignature(node)) {
//         if (node.type && ts.isFunctionTypeNode(node.type)) {
//           resolveMethod(node)
//           return
//         }
//         doc.properties.push(convertProperty(node))

//       } else if (ts.isIndexSignatureDeclaration(node)) {
//         doc.indexes.push({
//           kind: DocNodeKind.index,
//           name: resolveName(node.parameters[0].name),
//           jsdoc: getCommentFromNode(node),
//           keyType: convertType(node.parameters[0].type),
//           type: convertType(node.type)
//         })

//       } else if (ts.isConstructSignatureDeclaration(node)) {
//         doc.constructors.push(convertSignature(node))

//       } else {
//         warn(`Unknown node type in interface (kind: ${ts.SyntaxKind[node.kind]})`)
//       }
//     })

//   function resolveMethod (node: ts.MethodSignature | ts.PropertySignature): void {
//     const name = resolveName(node.name)

//     const functionDoc = doc.methods.find(method => method.name === name) || {
//       kind: DocNodeKind.function,
//       name,
//       signatures: []
//     }

//     functionDoc.signatures.push(convertSignature(node))

//     if (!doc.methods.includes(functionDoc)) doc.methods.push(functionDoc)
//   }

//   return doc
// }
