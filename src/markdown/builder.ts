export enum Alignment {
  left = '---',
  right = '--:',
  center = ':-:'
}

export class MarkdownBuilder {
  private lines: string[] = []

  constructor (public fileName: string) {}

  header (line: string, header = 3): this {
    const href = line.replace(/ /g, '-').toLocaleLowerCase()
    this.lines.push(`${'#'.repeat(header)} ${header <= 3 ? `[${line}](${href})` : line}\n`)
    return this
  }

  paragraph (line: string): this {
    return this.line(line + '\n')
  }

  line (line: string = ''): this {
    this.lines.push(line)
    return this
  }

  list (line: string, indent = 0): this {
    this.lines.push(' '.repeat(indent * 2) + ' - ' + line)
    return this
  }

  table (headers: string[], alignment: Alignment[], cells: string[][]): this {
    const toColumns = (arr: string[]) => arr
      .map(el => el.replace(/(\\|\|)/g, '\\$1').replace(/\n/g, '<br>'))
      .join(' | ').trim()

    this.lines.push(toColumns(headers))
    this.lines.push(alignment.join(' | '))
    this.lines.push(cells.map(toColumns).join('\n'), '')

    return this
  }

  toString (): string {
    return this.lines.join('\n')
  }
}
