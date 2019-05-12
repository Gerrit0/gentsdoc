# Gentsdoc

A (very) WIP documentation generator.

## Why?

There are already great documentation generators out there - [Api-Extractor], [TypeDoc], [DocFX]. Each one has their own benefits. Api-Extractor is well maintained, uses the [TSDoc] standard for parsing documentation comments, and provides several additional tools for managing documentation for large projects. TypeDoc has been around forever and has a variety of user plugins to customize generation. DocFX can also be used to generate documentation for .NET projects, and provides a way for cross-language teams to standardize their documentation.

All of these tools are rather heavy for my purposes. When I want to generate documentation it is usually for a fairly small library and only contains a few classes or functions. This library provides a lightweight way to generate a documentation page for a library. It does not attempt to replace projects which generate documentation for an application.

## Parsing

Like Api-Extractor, this project uses the [TSDoc] parser to parse doc comments. Unlike Api-Extractor (and like TypeDoc) it parses your original TypeScript source files, not the declaration files.

## Roadmap

- [ ] Enums
- [ ] Type aliases
  - [ ] Simple
  - [ ] Generic
  - [ ] Defaulted generic
  - [ ] Constrained generic (`T extends string`)
  - [ ] Conditional
- [ ] Interfaces
- [ ] Functions
  - [ ] Inferred return type
  - [ ] Varargs
  - [ ] Generics
  - [ ] Default arguments
  - [ ] Overloaded functions
- [ ] Classes
  - [ ] Simple classes
  - [ ] Generic classes
  - [ ] Static members
  - [ ] Instance members
  - [ ] `extends`
  - [ ] `implements`
  - [ ] `abstract`

[Api-Extractor]: https://api-extractor.com/
[TypeDoc]: https://typedoc.org/
[DocFX]: https://dotnet.github.io/docfx/tutorial/universalreference/gen_doc_for_ts.html
[TSDoc]: https://github.com/Microsoft/tsdoc
