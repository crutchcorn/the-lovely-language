const defaultKeyword = {
  match: /\S+/,
  type: "Identifier"
} as const;

const breakKeywords = [{
  match: /\s/,
  type: "Whitespace"
}, {
  match: /;/,
  type: "Semicolon"
}] as const;

const keywords = [{
  match: /infer/,
  type: "InferKeyword"
}, {
  match: /=/,
  type: "Equalsign"
}, {
  match: /-?\d+/,
  type: "Number"
}, {
  match: /"([^"]*)"/,
  type: "String"
}] as const;

export interface Token {
  type: typeof keywords[number]["type"] | typeof defaultKeyword["type"];
  val: string;
}

export function tokenize(code: string) {
  let currentToken = "";
  let tokens: Token[] = [];
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (!breakKeywords.some(keyword => keyword.match.test(char))) {
      currentToken += char;
      continue;
    }
    for (const keyword of keywords) {
      if (!keyword.match.test(currentToken)) {
        continue;
      }
      tokens.push({
        type: keyword.type,
        val: currentToken
      });
      currentToken = "";
      break;
    }
    if (!currentToken) {
      continue;
    }
    if (!defaultKeyword.match.test(currentToken)) {
      throw new Error(`Unexpected token: ${currentToken}`);
    }
    tokens.push({
      type: defaultKeyword.type,
      val: currentToken
    });
    currentToken = "";
  }

  return tokens;
}
