import { trim, getProperty } from './utils'

const SYMBOLS = ['{', '}', ':', ';', ' ', '>', '+', '(', ')', ',']
const SELECTORSYMBOLS = [' ', '>', '+', '::', ':']
const KEYWORDS = ['@mixin', '@include']

export function tokenize(input: string): string[] {
  let tokenList: string[] = []
  let n = 0
  let currentToken = ''
  const lines = input.split(/\r?\n/)

  while (n < lines.length) {
    const line = trim(lines[n]) // 直接略过缩进和行尾无意义的空格，性能优化
    let i = 0

    while (i < line.length) {
      if (SYMBOLS.includes(line[i])) {
        const lastToken = tokenList[tokenList.length - 1]

        if (line[i] === ':' && line[i + 1] === ':') {
          currentToken += line[i] + line[i + 1]
          i++
        } else if (line[i] === ' ' && (SYMBOLS.includes(lastToken) || KEYWORDS.includes(lastToken))) {
          currentToken = ''
        } else {
          currentToken += line[i]
        }

        if (currentToken) {
          if (lastToken === ' ') {
            tokenList[tokenList.length - 1] = currentToken
          } else {
            tokenList.push(currentToken)
          }
          currentToken = ''
        }
      } else {
        currentToken += line[i]

        if (SYMBOLS.includes(line[i + 1])) {
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
  variableDeclaration = 'VariableDeclaration',
  mixinDeclaration = 'MixinDeclaration',
  includeDeclaration = 'IncludeDeclaration'
}

export interface AST {
  type: ASTType
  originText: string
  body?: AST[],
  prop?: string,
  value?: string,
  params?: string[]
}

export function transformAST(tokenList: string[]): AST {
  let ast: AST = {
    type: ASTType.styleSheet,
    originText: '',
    body: []
  }
  let i = 0
  let currentLevel = ''
  let currentPath: number[] = []

  while (i < tokenList.length) {
    const currentToken = tokenList[i]
    const nextToken = tokenList[i + 1]

    if (currentToken === '@mixin') {
      const params: string[] = []
      if (tokenList[i + 2] === '(') {
        i += 3
        for (; i < tokenList.length; i++) {
          if (!SYMBOLS.includes(tokenList[i]) && tokenList[i].startsWith('$')) params.push(tokenList[i])
          if (tokenList[i + 1] === ')') break
        }
      }
      const currentObj = getProperty(ast, currentPath)
      currentObj.push({
        type: ASTType.mixinDeclaration,
        originText: nextToken,
        params,
        body: []
      })
      currentPath.push(currentObj.length - 1)
      i++
    } else if (currentToken === '@include') {
      const params: string[] = []
      if (tokenList[i + 2] === '(') {
        i += 3
        for (; i < tokenList.length; i++) {
          if (!SYMBOLS.includes(tokenList[i])) params.push(tokenList[i])
          if (tokenList[i + 1] === ')') break
        }
      }
      getProperty(ast, currentPath).push({
        type: ASTType.includeDeclaration,
        params,
        originText: nextToken
      })
      i++
    } else if (nextToken === '{') {
      currentLevel += currentToken
      const currentObj = getProperty(ast, currentPath)
      currentObj.push({
        type: ASTType.rule,
        originText: currentLevel,
        body: []
      })
      currentPath.push(currentObj.length - 1)
      currentLevel = ''
    } else if (nextToken === '}') {
      currentPath.pop()
      currentLevel = ''
    } else if (nextToken === ':' && tokenList[i + 3] === ';') {
      let type: ASTType
      if (currentToken.startsWith('$')) {
        type = ASTType.variableDeclaration
      } else {
        type = ASTType.styleDeclaration
      }
      getProperty(ast, currentPath).push({
        type: type,
        originText: currentToken + ':' + tokenList[i + 2],
        prop: currentToken,
        value: tokenList[i + 2]
      })
      i += 2
      currentLevel = ''
    } else if (SELECTORSYMBOLS.includes(currentToken) || !SYMBOLS.includes(currentToken)) {
      currentLevel += currentToken
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
