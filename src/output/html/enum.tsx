import * as ts from 'typescript'
import * as React from 'react'
import { Context } from '../../context'

export function renderEnum (context: Context) {
  // Render nothing if not an enum
  if ((context.symbol.flags & ts.SymbolFlags.Enum) === 0) {
    return
  }

  return (
    <div className='enum' key={context.name}>
      <h3>enum {context.name}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {context.exportContexts.map(renderEnumMember)}
        </tbody>
      </table>
    </div>
  )
}

function renderEnumMember (member: Context) {
  // Declaration merging means that this might not be a member.
  if (!ts.isEnumMember(member.declaration)) {
    return
  }

  const value = member.checker.getConstantValue(member.declaration)
  return (
    <tr className='enum-member' key={member.name}>
      <td>{member.name}</td>
      <td>{JSON.stringify(value)}</td>
    </tr>
  )
}
