<div align="center">
<h1>The Lovely Language</h1>

<a href="https://joypixels.com/profiles/emoji/sparkling-heart">
  <img
    height="80"
    width="80"
    alt="playground slide"
    src="./other/sparkling-heart.png"
  />
</a>

<p>An experimental homegrown coding language.</p>

</div>

<div align="center">

[![Build Status](https://img.shields.io/github/actions/workflow/status/crutchcorn/the-lovely-language/build.yml?branch=main)](https://github.com/crutchcorn/the-lovely-language/actions/workflows/build.yml?query=branch%3Amain)
[![Test Status](https://img.shields.io/github/actions/workflow/status/crutchcorn/the-lovely-language/test.yml?branch=main&label=tests)](https://github.com/crutchcorn/the-lovely-language/actions/workflows/test.yml?query=branch%3Amain)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE.md)

</div>

The goals of this project are:

- Fully homegrown
- No dependencies
- Start with lexer and parser
  - No runtime or compiler (yet)
- Static typings
  - No runtime or build-time type checking (yet)

## Syntax

```shell
infer Test = 0 + 1 + 2;
infer Other = 0;
```

Outputs the following AST:

```json
{
  "type": "Program",
  "body": [
    {
      "type": "InferStatement",
      "identifier": {
        "type": "Identifier",
        "val": "Test"
      },
      "value": {
        "type": "AddStatement",
        "left": {
          "type": "Number",
          "val": "0"
        },
        "right": {
          "type": "AddStatement",
          "left": {
            "type": "Number",
            "val": "1"
          },
          "right": {
            "type": "Number",
            "val": "2"
          }
        }
      }
    },
    {
      "type": "InferStatement",
      "identifier": {
        "type": "Identifier",
        "val": "Test"
      },
      "value": {
        "type": "Number",
        "val": "0"
      }
    }
  ]
}
```

> This project is currently held together by ducktape and string. I've never built a lexer, parser, or compiler before.
>
> I'm learning as I go. I'm sure there are many things I'm doing wrong. I'm open to feedback.
>
> I'm also intentionally taking the slow route at times and not referencing existing implementation or documentation at this time.
