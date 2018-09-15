import * as tsdoc from '@microsoft/tsdoc'
import * as ts from 'typescript'
import { chain, Converter, toArray } from '../utils'
import { resolveExpression, resolveName } from '../utils/nodes'
import { AbstractConverter } from './abstract'

export interface EnumReflection {
  name: string
  const: boolean
  members: EnumMemberReflection[]
  docs?: tsdoc.DocComment
}

export interface EnumMemberReflection {
  name: string
  value: string
  type: 'string' | 'number'
  docs?: tsdoc.DocComment
}

@Converter
export class EnumConverter extends AbstractConverter {
  supports (symbol: ts.Symbol): boolean {
    return toArray(symbol.getDeclarations()).some(ts.isEnumDeclaration)
  }

  convert (symbol: ts.Symbol): void {
    const declarations = toArray(symbol.getDeclarations()).filter(ts.isEnumDeclaration)

    const reflection: EnumReflection = {
      name: symbol.getName(),
      const: (symbol.getFlags() & ts.SymbolFlags.ConstEnum) !== 0,
      members: []
    }

    reflection.docs = this.application.getDocComment(declarations)

    let enumIndex = 0

    chain(d => d.members, declarations).forEach(member => {
      if (member.initializer && !ts.isStringLiteral(member.initializer)) {
        enumIndex = +resolveExpression(member.initializer)
      }

      const type = member.initializer && ts.isStringLiteral(member.initializer) ? 'string' : 'number'
      reflection.members.push({
        name: resolveName(member.name),
        value: member.initializer ? resolveExpression(member.initializer) : (++enumIndex).toString(),
        docs: this.application.getDocComment(member),
        type
      })
    })

    this.application.emit('enum', reflection)
  }
}
