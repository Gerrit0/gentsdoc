export enum DocNodeKind {
  file = 0,
  function = 1,
  functionSignature = 2,
  enum = 4,
  enumMember = 8,
  class = 16,
  typeInterface = 32,
  typeAlias = 64,
  variable = 128,
  type = 256,
  simpleType = 257, // type | 1
  tupleType = 258, // type | 2
  objectType = 260, // type | 4
  functionTypeDocNode = 264, // type | 8
  property = 512,
  index = 1024
}

export interface DocNode {
  /**
   * May be the empty string or __unknown if not known.
   */
  name: string
  kind: DocNodeKind
}

export type DocNodeVisibility = 'public' | 'private' | 'protected'

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
 * Almost everything in this file.
 */
export interface InterfaceDocNode extends DocNode {
  kind: DocNodeKind.typeInterface
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  properties: PropertyDocNode[]
  indexes: IndexSignatureDocNode[]
  methods: FunctionDocNode[]
  signatures: FunctionSignatureDocNode[]
  constructors: FunctionSignatureDocNode[]
  extends: string[]
}

/**
 * Enumerations
 */
export interface EnumDocNode extends DocNode {
  kind: DocNodeKind.enum
  jsdoc: DocNodeComment
  const: boolean
  members: EnumMemberDocNode[]
}

export interface EnumMemberDocNode extends DocNode {
  kind: DocNodeKind.enumMember
  jsdoc: DocNodeComment
  type: 'string' | 'number'
  value: string
}

/**
 * Classes
 */
export interface ClassDocNode extends DocNode {
  kind: DocNodeKind.class
  extends?: string
  implements: string[]
  abstract: boolean
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  constructors: FunctionSignatureDocNode[]
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
  kind: DocNodeKind.functionSignature
  jsdoc: DocNodeComment
  genericTypes: TypeDocNode[]
  parameters: TypeDocNode[]
  returnType: TypeDocNode
  visibility?: DocNodeVisibility
  /**
   * Only used in classes
   */
  abstract?: boolean
}

/**
 * Formatted as `[name: keyType]: type`
 */
export interface IndexSignatureDocNode extends DocNode {
  kind: DocNodeKind.index,
  jsdoc: DocNodeComment,
  keyType: TypeDocNode
  type: TypeDocNode
}

/**
 * Used within exported members to represent their type.
 */
export interface TypeDocNode extends DocNode {
  /**
   * The comment for this node, marked with @param, @property, or @prop
   */
  comment: string
  /**
   * True if the type is optional
   */
  optional: boolean
  /**
   * If applicable, the type that this type extends. Used by interfaces and potentially by generic types.
   */
  extends?: string
  /**
   * If applicable, the initializer for this node, only used by generic types.
   */
  initializer?: string
  /**
   * If applicable, generally used in object types
   */
  rest?: boolean
}

/**
 * Used within classes and objects
 */
export interface PropertyDocNode extends DocNode {
  kind: DocNodeKind.property

  readonly?: boolean
  optional?: boolean
  visibility: DocNodeVisibility
  /**
   * Only used in classes
   */
  abstract?: boolean

  jsdoc: DocNodeComment

  type: TypeDocNode
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
  members: TypeDocNode[]
}

/**
 * Function types
 */
export interface FunctionTypeDocNode extends TypeDocNode {
  kind: DocNodeKind.functionTypeDocNode
  genericTypes: TypeDocNode[]
  parameters: TypeDocNode[]
  returnType: TypeDocNode
}
