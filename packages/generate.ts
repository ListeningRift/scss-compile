import { AST, ASTType } from './parse'
import os from 'os'

export function getStyleMap(
  ast: AST,
  level: string[] = [],
  scope: any = {},
  rulesOrder: string[] = [],
  styleMap: Record<string, Record<string, string>> = {}
): [string[], Record<string, Record<string, string>>] {
  for (let i = 0; i < ast.body!.length; i++) {
    const current = ast.body![i]

    if (current.type === ASTType.rule) {
      if (current.originText.includes('&')) {
        const tempLevel = [current.originText.replace(/\&/g, level.join(' '))]
        rulesOrder.push(tempLevel[0])
        styleMap[tempLevel[0]] = {}

        ;[rulesOrder, styleMap] = getStyleMap(current, tempLevel, JSON.parse(JSON.stringify(scope)), rulesOrder, styleMap)
      } else {
        level.push(current.originText)
        rulesOrder.push(level.join(' '))
        styleMap[level.join(' ')] = {}

        ;[rulesOrder, styleMap] = getStyleMap(current, level, JSON.parse(JSON.stringify(scope)), rulesOrder, styleMap)
        level.pop()
      }
    } else if (current.type === ASTType.styleDeclaration) {
      if (current.value!.startsWith('$')) {
        styleMap[level.join(' ')][current.prop!] = scope[current.value!]
      } else {
        styleMap[level.join(' ')][current.prop!] = current.value!
      }
    } else if (current.type === ASTType.variableDeclaration) {
      scope[current.prop!] = current.value!
    }
  }

  return [rulesOrder, styleMap]
}

export default function generate(ast: AST, minify = false): string {
  const {
    spacer,
    EOL
  } = minify
    ? { spacer: '', EOL: '' }
    : {
      spacer: ' ',
      EOL: os.EOL
    }
  const [rulesOrder, styleMap] = getStyleMap(ast)

  let res = ''

  for (let i = 0; i < rulesOrder.length; i++) {
    res += rulesOrder[i] + spacer + '{' + EOL

    for (const key in styleMap[rulesOrder[i]]) {
      res += spacer + spacer + key + ':' + spacer + styleMap[rulesOrder[i]][key] + ';' + EOL
    }

    res += '}' + EOL
    if (i !== rulesOrder.length - 1) {
      res += EOL
    }
  }

  return res
}
