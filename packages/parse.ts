import { trim, getProperty } from './utils'

const symbols = ['{', '}', ':', ';', ' ', '>', '+']
const selectorSymbols = [' ', '>', '+', '::', ':']

export function tokenize(input: string): string[] {
  let tokenList: string[] = []
  let n = 0
  let currentToken = ''
  const lines = input.split(/[(\r\n)\r\n]+/)

  while (n < lines.length) {
    const line = trim(lines[n]) // 直接略过缩进和行尾无意义的空格，性能优化
    let i = 0

    while (i < line.length) {
      if (symbols.includes(line[i])) {
        if (line[i] === ':' && line[i + 1] === ':') {
          currentToken += line[i] + line[i + 1]
          i++
        } else if (line[i] === ' ' && symbols.includes(line[i - 1])) {
          currentToken = ''
        } else {
          currentToken += line[i]
        }

        if (currentToken) {
          if (tokenList[tokenList.length - 1] === ' ') {
            tokenList[tokenList.length - 1] = currentToken
          } else {
            tokenList.push(currentToken)
          }
          currentToken = ''
        }
      } else {
        currentToken += line[i]

        if (symbols.includes(line[i + 1])) {
          tokenList.push(currentToken)
          currentToken = ''
        }
      }
      i++
    }
    n++
  }

  return tokenList
}

export const enum ASTType {
  styleSheet = 'StyleSheet',
  rule = 'StyleRule',
  styleDeclaration = 'StyleDeclaration',
  variableDeclaration = 'VariableDeclaration'
}

export interface AST {
  type: ASTType
  originText: string
  body?: AST[],
  prop?: string,
  value?: string
}

export function transformAST(tokenList: string[]): AST {
  let ast: AST = {
    type: ASTType.styleSheet,
    originText: '',
    body: []
  }
  let i = 0
  let currentScope = ''
  let currentLevel: number[] = []

  while (i < tokenList.length) {
    const currentToken = tokenList[i]
    const nextToken = tokenList[i + 1]
    if (nextToken === '{') {
      currentScope += currentToken
      const currentObj = getProperty(ast, currentLevel)
      currentObj.push({
        type: ASTType.rule,
        originText: currentScope,
        body: []
      })
      currentLevel.push(currentObj.length - 1)
      currentScope = ''
    } else if (nextToken === '}') {
      currentLevel.pop()
      currentScope = ''
    } else if (nextToken === ':' && tokenList[i + 3] === ';') {
      let type: ASTType
      if (currentToken.startsWith('$')) {
        type = ASTType.variableDeclaration
      } else {
        type = ASTType.styleDeclaration
      }
      getProperty(ast, currentLevel).push({
        type: type,
        originText: currentToken + ':' + tokenList[i + 2],
        prop: currentToken,
        value: tokenList[i + 2]
      })
      i += 2
      currentScope = ''
    } else if (selectorSymbols.includes(currentToken) || !symbols.includes(currentToken)) {
      currentScope += currentToken
    }
    i++
  }

  return ast
}

export default function parse(input: string): AST {
  const tokenList = tokenize(input)
  const ast = transformAST(tokenList)
  return ast
}
