import { expect, test } from "vitest";
import { tokenize } from "./lexer";

test("lexer should tokenize a basic infer assignment", () => {
  const source = `
    infer Test = 0;
  `;

  const tokens = tokenize(source);

  expect(tokens).toMatchInlineSnapshot(`
    [
      {
        "type": "InferKeyword",
        "val": "infer",
      },
      {
        "type": "Identifier",
        "val": "Test",
      },
      {
        "type": "EqualSign",
        "val": "=",
      },
      {
        "type": "Number",
        "val": "0",
      },
    ]
  `);
});
