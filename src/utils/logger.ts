import colors from 'colors/safe'

export enum LogLevel {
  error,
  warn,
  info
}

export class Logger {
  static level = LogLevel.error

  static log (message: string): void {
    console.log(message)
  }

  static info (message: string): void {
    if (this.level === LogLevel.info) {
      console.log(colors.cyan(message))
    }
  }

  static warn (message: string): void {
    if (this.level >= LogLevel.warn) {
      console.warn(colors.yellow(message))
    }
  }

  static error (message: string | Error): void {
    console.error(colors.red(message instanceof Error ? message.message : message))
  }
}
