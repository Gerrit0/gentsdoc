import { Context } from '../../..'
import React from 'react'
import { TSDoc } from './tsdoc'
import { Renderer } from '../renderer'
import { SymbolFlags } from 'typescript'

export function renderEnum (context: Context, _renderer: Renderer) {
  const nodes: Array<React.ReactNode> = [
    (<h1 key='name' id={context.fullReference}>Enum {context.name}</h1>),
    (<TSDoc key='comment' node={context} />)
  ]

  nodes.push(...context.exportContexts.map(renderEnumMember))

  return <React.Fragment>{nodes}</React.Fragment>
}

export function renderEnumMember (context: Context) {
  if (!context.hasFlag(SymbolFlags.EnumMember)) {
    return
  }

  return <p key={context.name} id={context.fullReference}>{context.name}</p>
}
