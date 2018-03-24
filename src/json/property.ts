// import { DocNodeKind, PropertyDocNode } from '../schema'
// import { getCommentFromNode, resolveName, getPropertyComment, getVisibility } from '../helpers'
// import { convertType } from './type'
// import * as ts from 'typescript'
// import { toArray } from 'lodash'

// export function convertProperty (node: ts.PropertySignature | ts.PropertyDeclaration): PropertyDocNode {
//   return {
//     kind: DocNodeKind.property,
//     name: resolveName(node.name),
//     type: convertType(node.type, getPropertyComment(node)),
//     jsdoc: getCommentFromNode(node),
//     optional: !!node.questionToken,
//     readonly: toArray(node.modifiers).some(m => m.kind === ts.SyntaxKind.ReadonlyKeyword),
//     visibility: getVisibility(node.modifiers)
//   }
// }
