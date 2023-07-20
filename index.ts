import {tokenize} from "./lexer";
import {parse} from "./parser";

const source = `
infer Test = 0;
`;

const tokens = tokenize(source);
const ast = parse(tokens);
console.log(JSON.stringify({tokens, ast}, null, 2));
