import { expect, test } from "vitest";
import { tokenize } from "./lexer";
import { parse } from "./parser";

test("lexer should tokenize a basic infer assignment", () => {
  const source = `
    infer Test = 0;
  `;

  const tokens = tokenize(source);

  const ast = parse(tokens);

  expect(ast).toMatchInlineSnapshot(`
    {
      "body": [
        {
          "identifier": {
            "type": "Identifier",
            "val": "Test",
          },
          "type": "InferStatement",
          "value": {
            "type": "Number",
            "val": "0",
          },
        },
      ],
      "type": "Program",
    }
  `);
});
