import { Token } from "./lexer";

function getOperandType(
  statementName: "AddStatement" | "SubtractStatement",
  operandOperator: Token["type"],
) {
  return {
    identify: (tokens: Token[], idx: number) => {
      const left = tokens[idx];
      const operator = tokens[idx + 1];
      const right = tokens[idx + 2];
      const allowedLeftTypes = ["Number", "String"];
      const allowedOperators = [operandOperator];
      const allowedRightTypes = ["Number", "String"];
      if (
        operator &&
        right &&
        allowedLeftTypes.includes(left.type) &&
        allowedOperators.includes(operator.type) &&
        allowedRightTypes.includes(right.type)
      ) {
        return true;
      }
      return false;
    },
    parse: (tokens: Token[], idx: number) => {
      const left = tokens[idx];
      const _operator = tokens[idx + 1];
      const right = tokens[idx + 2];

      const isNextANode = innerParse(tokens, idx + 2);

      return {
        node: {
          type: statementName,
          left: left,
          right: isNextANode?.node ?? right,
        },
        changeIndexBy: 2 + (isNextANode ? isNextANode.changeIndexBy : 0),
      } as const;
    },
  };
}

export interface InferStatement<T = unknown> {
  type: "InferStatement";
  identifier: Token;
  value: T;
}

export interface AddStatement<LeftType = unknown, RightType = unknown> {
  type: "AddStatement";
  left: LeftType;
  right: RightType;
}

export interface SubtractStatement<LeftType = unknown, RightType = unknown> {
  type: "SubtractStatement";
  left: LeftType;
  right: RightType;
}

type ASTNode = InferStatement | AddStatement | SubtractStatement;

interface AST {
  type: "Program";
  body: ASTNode[];
}

const matchers = {
  InferStatement: {
    identify: (tokens: Token[], idx: number) => {
      const keyword = tokens[idx];
      const allowedKeywords = ["InferKeyword"];
      if (allowedKeywords.includes(keyword.type)) {
        return true;
      }
      return false;
    },
    parse: (tokens: Token[], idx: number) => {
      const identifier = tokens[idx + 1];
      const equalsign = tokens[idx + 2];
      const value = tokens[idx + 3];

      if (identifier.type !== "Identifier") {
        throw new Error(`Unexpected token: ${identifier.val}`);
      }
      if (equalsign.type !== "EqualSign") {
        throw new Error(`Unexpected token: ${equalsign.val}`);
      }
      const allowedValueTypes = ["Number", "String"];
      if (!allowedValueTypes.includes(value.type)) {
        throw new Error(`Unexpected token: ${value.val}`);
      }

      const isNextANode = innerParse(tokens, idx + 3);

      return {
        node: {
          type: "InferStatement",
          identifier: identifier,
          value: isNextANode?.node ?? value,
        },
        changeIndexBy: 4 + (isNextANode ? isNextANode.changeIndexBy : 0),
      } as const;
    },
  },
  AddStatement: getOperandType("AddStatement", "PlusSign"),
  SubtractStatement: getOperandType("SubtractStatement", "MinusSign"),
};

function innerParse(
  tokens: Token[],
  idx: number,
): { node: ASTNode; changeIndexBy: number } | undefined {
  for (const matcher of Object.values(matchers)) {
    if (matcher.identify(tokens, idx)) {
      return matcher.parse(tokens, idx);
    }
  }
}

export function parse(tokens: Token[]): AST {
  const ast = {
    type: "Program",
    body: [] as ASTNode[],
  } satisfies AST;

  let i = 0;
  while (true) {
    let matched = false;
    for (const [_name, matcher] of Object.entries(matchers)) {
      if (i >= tokens.length) {
        break;
      }
      if (matcher.identify(tokens, i)) {
        const { node, changeIndexBy } = matcher.parse(tokens, i);
        ast.body.push(node);
        i += changeIndexBy;
        matched = true;
        continue;
      }
    }
    if (!matched) {
      const token = tokens[i];
      throw new Error(`Unexpected token: ${token.val}`);
    }
    if (i >= tokens.length) {
      break;
    }
  }

  return ast;
}
