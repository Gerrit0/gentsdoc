# Status

On hold - I don't want to duplicate work done over at [Microsoft/tsdoc](https://github.com/Microsoft/tsdoc)

# Gentsdoc

[![Build Status](https://travis-ci.org/Gerrit0/gentsdoc.svg?branch=master)](https://travis-ci.org/Gerrit0/gentsdoc) [![Greenkeeper badge](https://badges.greenkeeper.io/Gerrit0/gentsdoc.svg)](https://greenkeeper.io/)

## Progress

1. Basic JSON structure complete
1. Markdown done for `enum` and `function`

## Goals

1. JSON schema for documenting Typescript projects, the following features should be documented:
    - Enumerations, including declaration merging, string enums, and merging doc comments.
    - Functions, including multiple signatures, destructured parameters, rest parameters, and generics.
    - Classes, with support for both static and instance properties and functions and generic classes.
    - Interfaces, with support for generics and call signatures.
    - Types, with support for generics and documenting tuple types.
    - Support for both named and default exports.
    - Support for documenting regular variable exports.
1. CLI entry point for specifying input and output files and options for treating declaration files.
1. Programmable entry point with the same capabilities as the CLI entry point.
1. Basic markdown theme.
1. HTML theme with support for user (sub?)themes.
1. Plugin structure for custom themes if the html theme is too limiting.

## Non-goals (for now)

1. Documenting files which are not ES Modules.
1. Support for namespaces. See the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/modules.html#do-not-use-namespaces-in-modules) for why you should not use namespaces in modules.

## Motivation

I have used [Typedoc](https://github.com/TypeStrong/typedoc) in the past for generating documentation for Typescript projects. In general, I enable [Greenkeeper](https://greenkeeper.io/) to avoid outdated dependencies and potential vulnerabilities. This presents a problem with Typedoc since Typedoc [relies on internal APIs](https://github.com/TypeStrong/typedoc/issues/655#issuecomment-348983162) and cannot be automatically updated to the latest version. In addition to this, at the time of this writing, Typedoc's [tests are broken](https://github.com/TypeStrong/typedoc/issues/616) and cannot be used to determine if changes to the application break anything. Typedoc is an amazing tool, but cannot always be used with the latest version of Typescript which makes using it difficult for projects with Greenkeeper.
