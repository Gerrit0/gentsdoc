import * as colors from 'colors/safe'

export abstract class Logger {
  abstract error (message: string): void
  abstract warn (message: string): void
  abstract info (message: string): void
  abstract debug (message: string): void
  abstract success (message: string): void
}

export class ConsoleLogger extends Logger {
  info (message: string): void {
    console.log(colors.cyan(message))
  }
  error (message: string): void {
    console.log(colors.red(message))
  }
  warn (message: string) {
    console.log(colors.yellow(message))
  }
  debug (message: string): void {
    console.log(colors.gray(message))
  }
  success (message: string): void {
    console.log(colors.green(message))
  }
}
