import { tokenize } from "./lexer";
import { parse } from "./parser";

const source = `
infer Test = 0 + 1 + 2;
infer Other = 0;
`;

const tokens = tokenize(source);
const ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));
