export enum DocNodeKind {
  file = 0,
  function = 1,
  enum = 2,
  enumMember = 4,
  class = 8,
  typeInterface = 16,
  typeAlias = 32,
  variable = 64,
  type = 128,
  simpleType = 129, // type | 1
  tupleType = 130, // type | 2
  objectType = 132 // type | 4
}

export interface DocNode {
  /**
   * May be the empty string if not known.
   */
  name: string
  kind: DocNodeKind
}

export interface FileDocNode extends DocNode {
  kind: DocNodeKind.file

  jsdoc: DocNodeComment
  /**
   * All exported functions, including exported function expressions.
   */
  functions: FunctionDocNode[]
  /**
   * All exported enumerations.
   */
  enumerations: EnumDocNode[]
  /**
   * All exported classes.
   */
  classes: ClassDocNode[]
  /**
   * All exported interfaces.
   */
  interfaces: InterfaceDocNode[]
  /**
   * All exported types.
   */
  types: TypeAliasDocNode[]
  /**
   * All exported variables which are not functions.
   */
  variables: VariableDocNode[]

  /**
   * The default export, can be any type.
   */
  default?: DocNode
}

/**
 * Used to represent where in a file the doc node came from
 */
export interface SourceDescription {
  file: string
  line: number
  character: number
}

/**
 * Used to represent a jsdoc comment
 */
export interface DocNodeComment {
  comment: string
  tags: DocNodeTag[]
}

/**
 * jsdoc tags, with the exceptions of @property and @param
 */
export interface DocNodeTag {
  tagName: string
  comment: string
}

/**
 * @example
 * export const a = 1
 * export const b = { a: 2 }
 * export let c = [1, 'hi']
 */
export interface VariableDocNode extends DocNode {
  kind: DocNodeKind.variable
  jsdoc: DocNodeComment
  type: TypeDocNode
  const?: boolean
}

/**
 * @example
 * export type a = number
 * export type b = string
 * export type c = a | b
 */
export interface TypeAliasDocNode extends DocNode {
  kind: DocNodeKind.typeAlias
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  type: TypeDocNode
}

/**
 * @example
 * Almost everything in this file.
 */
export interface InterfaceDocNode extends DocNode {
  kind: DocNodeKind.typeInterface
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  /**
   * Will not contain generic types.
   */
  type: ObjectTypeDocNode
}

/**
 * Enumerations
 */
export interface EnumDocNode extends DocNode {
  kind: DocNodeKind.enum
  jsdoc: DocNodeComment
  const: boolean
  members: EnumMemberDocNode[]
  sources: SourceDescription[]
}

export interface EnumMemberDocNode extends DocNode {
  kind: DocNodeKind.enumMember
  jsdoc: DocNodeComment
  type: 'string' | 'number'
  value: string
  source: SourceDescription
}

/**
 * Classes
 */
export interface ClassDocNode extends DocNode {
  kind: DocNodeKind.class
  extends?: string
  abstract: boolean
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  properties: PropertyDocNode[]
  methods: FunctionDocNode[]
  staticProperties: PropertyDocNode[]
  staticMethods: FunctionDocNode[]
}

/**
 * Functions
 */
export interface FunctionDocNode extends DocNode {
  kind: DocNodeKind.function

  /**
   * Unless overloaded, there will only be one item in the array.
   */
  signatures: FunctionSignatureDocNode[]
}

export interface FunctionSignatureDocNode extends DocNode {
  genericTypes: TypeDocNode[]
  parameters: TypeDocNode[]
  returnType: TypeDocNode
}

/**
 * Used within exported members to represent their type.
 */
export interface TypeDocNode extends DocNode {
  comment: string
  /**
   * If applicable, the type that this type extends. Used by interfaces and potentially by generic types.
   */
  extends?: string
}

/**
 * Used within classes and objects
 */
export interface PropertyDocNode extends TypeDocNode {
  readonly: boolean
  /**
   * Not provided for basic objects
   */
  visibility?: 'public' | 'protected' | 'private'
}

/**
 * All types from https://www.typescriptlang.org/docs/handbook/basic-types.html
 * Also includes type references to another type, type intersections and unions
 * as they cannot be described further easily.
 */
export interface SimpleTypeDocNode extends TypeDocNode {
  kind: DocNodeKind.simpleType
  type: string
}

/**
 * Tuple types
 */
export interface TupleTypeDocNode extends TypeDocNode {
  kind: DocNodeKind.tupleType
  members: TypeDocNode[]
}

/**
 * Object types
 */
export interface ObjectTypeDocNode extends TypeDocNode {
  kind: DocNodeKind.objectType
  members: PropertyDocNode[]
}
