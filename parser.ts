import {Token} from "./lexer";

export interface InferStatement<T = unknown> {
  type: "InferStatement";
  identifier: string;
  value: T;
}

type ASTNode = InferStatement;

interface AST {
  type: "Program";
  body: ASTNode[];
}

const matchers = {
  InferStatement: (tokens: Token[], idx: number) => {
    const identifier = tokens[idx + 1];
    const equalsign = tokens[idx + 2];
    const value = tokens[idx + 3];
    if (identifier.type !== "Identifier") {
      throw new Error(`Unexpected token: ${identifier.val}`);
    }
    if (equalsign.type !== "Equalsign") {
      throw new Error(`Unexpected token: ${equalsign.val}`);
    }
    const allowedValueTypes = ["Number", "String"];
    if (!allowedValueTypes.includes(value.type)) {
      throw new Error(`Unexpected token: ${value.val}`);
    }
    return {
      node: {
        type: "InferStatement",
        identifier: identifier.val,
        value: value.val
      }, changeIndexBy: 3
    } as const;
  }
}

export function parse(tokens: Token[]): AST {
  const ast = {
    type: "Program",
    body: [] as ASTNode[]
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "InferKeyword") {
      const {node, changeIndexBy} = matchers.InferStatement(tokens, i);
      ast.body.push(node);
      i += changeIndexBy;
      continue;
    }
    throw new Error(`Unexpected token: ${token.val}`);
  }

  return ast;
}
