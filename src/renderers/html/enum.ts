import { EnumReflection, EnumMemberReflection } from '../../converters'
import { template } from './template'
import { renderDoc } from './doc'

export function renderEnum (reflection: EnumReflection) {
  return template`<div class="doc-member">
    <h3 id="${reflection.name}">Enumeration ${reflection.name}</h3>
    ${renderDoc(reflection.docs)}

    <table class="enum-table">
      <thead>
        <tr><th>Member</th><th>Value</th><th>Comment</th></tr>
      </thead>
      <tbody>
        ${reflection.members.map(renderMember)}
      </tbody>
    </table>
</div>`
}

export function renderMember (reflection: EnumMemberReflection): string {
  return template`<tr><td>${reflection.name}</td><td>${reflection.value}</td><td>${renderDoc(reflection.docs)}</td></tr>`
}
