import { FileDocNode, DocNodeKind } from '../schema'
import * as ts from 'typescript'
import { getFileComment, warn } from '../helpers'
import { toArray } from 'lodash'
import { convertEnum } from './enum'
import { convertFunction } from './function'
import { convertAlias } from './alias'
import { convertInterface } from './interface'
import { convertClass } from './class'
import { convertVariable } from './variable'

export function convertFile (file: ts.SourceFile, checker: ts.TypeChecker): FileDocNode {
  const doc: FileDocNode = {
    name: file.fileName,
    kind: DocNodeKind.file,
    jsdoc: getFileComment(file),
    functions: [],
    enumerations: [],
    classes: [],
    interfaces: [],
    types: [],
    variables: []
  }

  const moduleSymbol = checker.getSymbolAtLocation(file)

  if (!moduleSymbol) {
    warn(`${file.fileName} is not a module. No documentation will be generated`)
    return doc
  }

  const moduleExports = checker.getExportsOfModule(moduleSymbol)

  moduleExports.forEach(symbol => {
    let declarations = toArray(symbol.declarations)

    // export { Enum1, Class1 }
    // Get the actual node that needs to be documented
    const exportSpecifier = declarations.find(ts.isExportSpecifier)
    if (exportSpecifier) {
      const specifier = checker.getExportSpecifierLocalTargetSymbol(exportSpecifier)
      if (specifier) {
        symbol = specifier
        declarations = toArray(symbol.declarations)
      }
    }

    const context = { checker, symbol }

    // export enum Enum1, export class Class1
    if (declarations.some(ts.isEnumDeclaration)) {
      doc.enumerations.push(convertEnum(context))
    }
    if (declarations.some(ts.isFunctionDeclaration)) {
      doc.functions.push(convertFunction(context))
    }
    if (declarations.some(ts.isTypeAliasDeclaration)) {
      doc.types.push(convertAlias(context))
    }
    if (declarations.some(ts.isInterfaceDeclaration)) {
      doc.interfaces.push(convertInterface(context))
    }
    if (declarations.some(ts.isClassDeclaration)) {
      doc.classes.push(convertClass(context))
    }
    const variable = declarations.find(ts.isVariableDeclaration)
    if (variable) {
      if (variable.type && ts.isFunctionTypeNode(variable.type)) {
        doc.functions.push(convertFunction(context))
      } else {
        doc.variables.push(convertVariable(context))
      }
    }
  })

  return doc
}