# Snapshot report for `test\json\variable.spec.ts`

The actual snapshot is saved in `variable.spec.ts.snap`.

Generated by [AVA](https://ava.li).

## An object type

> Snapshot 1

    {
      jsdoc: {
        comment: 'A more complex type',
        tags: [
          {
            comment: '- Use a and b instead',
            tagName: 'deprecated',
          },
        ],
      },
      kind: 128,
      name: 'd',
      type: {
        comment: '',
        kind: 260,
        members: [
          {
            comment: '',
            kind: 257,
            name: 'a',
            optional: false,
            type: 'number',
          },
          {
            comment: '',
            kind: 257,
            name: 'b',
            optional: false,
            type: 'number',
          },
        ],
        name: '__unknown',
        optional: false,
      },
    }

## Exported later

> Snapshot 1

    {
      jsdoc: {
        comment: 'Exported later',
        tags: [],
      },
      kind: 128,
      name: 'f',
      type: {
        comment: '',
        kind: 257,
        name: '__unknown',
        optional: false,
        type: 'string',
      },
    }

## Numeric literal

> Snapshot 1

    {
      jsdoc: {
        comment: 'A numeric literal',
        tags: [],
      },
      kind: 128,
      name: 'e',
      type: {
        comment: '',
        kind: 257,
        name: '__unknown',
        optional: false,
        type: 'number',
      },
    }

## const

> Snapshot 1

    {
      jsdoc: {
        comment: 'A const number',
        tags: [
          {
            comment: 'b',
            tagName: 'see',
          },
        ],
      },
      kind: 128,
      name: 'a',
      type: {
        comment: '',
        kind: 257,
        name: '__unknown',
        optional: false,
        type: 'number',
      },
    }

## let

> Snapshot 1

    {
      jsdoc: {
        comment: 'A let number',
        tags: [],
      },
      kind: 128,
      name: 'b',
      type: {
        comment: '',
        kind: 257,
        name: '__unknown',
        optional: false,
        type: 'number',
      },
    }

## var

> Snapshot 1

    {
      jsdoc: {
        comment: 'A var number',
        tags: [],
      },
      kind: 128,
      name: 'c',
      type: {
        comment: '',
        kind: 257,
        name: '__unknown',
        optional: false,
        type: 'number',
      },
    }
