// Supported types: string, string[], boolean
export interface GentsdocOptions {
  entry: string
  help: boolean
}

export type AllowedOptionTypes = string | boolean // | string[]

export type GentsdocOptionsLax = Partial<GentsdocOptions> & Record<string, AllowedOptionTypes>

export * from './options'
