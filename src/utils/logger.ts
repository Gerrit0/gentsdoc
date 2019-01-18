import * as colors from 'colors/safe'

export interface Logger {
  log (message: string): void
  info (message: string): void
  warn (message: string): void
  error (message: string | Error): void
}

export class ConsoleLogger implements Logger {
  log (message: string): void {
    console.log(message)
  }
  info (message: string): void {
    console.log(colors.cyan(message))
  }
  warn (message: string): void {
    console.warn(colors.yellow(message))
  }
  error (message: string | Error): void {
    console.error(colors.red(message instanceof Error ? message.message : message))
  }
}
