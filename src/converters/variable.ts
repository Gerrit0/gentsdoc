// import { DocNodeKind, VariableDocNode } from '../schema'
// import * as ts from 'typescript'
// import { getPropertyComment, getCommentFromSymbol } from '../helpers'
// import { convertType } from './type'
// import { Context } from './common'

// export function convertVariable ({ symbol, checker }: Context): VariableDocNode {
//   const declaration = symbol.declarations!.find(ts.isVariableDeclaration)!
//   const type = declaration.type || checker.typeToTypeNode(checker.getTypeAtLocation(declaration), declaration)

//   const doc: VariableDocNode = {
//     name: symbol.name,
//     kind: DocNodeKind.variable,
//     type: convertType(type, getPropertyComment(declaration)),
//     jsdoc: getCommentFromSymbol(symbol)
//   }

//   return doc
// }
