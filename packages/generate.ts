import { AST, ASTType } from './parse'
import os from 'os'

export function getStyleMap(
  ast: AST,
  scope: string[] = [],
  rulesOrder: string[] = [],
  styleMap: Record<string, Record<string, string>> = {}
): [string[], Record<string, Record<string, string>>] {
  for (let i = 0; i < ast.body!.length; i++) {
    const current = ast.body![i]

    if (current.type === ASTType.CSSStyleRule) {
      if (current.originText.includes('&')) {
        const tempScope = [current.originText.replace(/\&/g, scope.join(' '))]
        rulesOrder.push(tempScope[0])
        styleMap[tempScope[0]] = {}

        ;[rulesOrder, styleMap] = getStyleMap(current, tempScope, rulesOrder, styleMap)
      } else {
        scope.push(current.originText)
        rulesOrder.push(scope.join(' '))
        styleMap[scope.join(' ')] = {}

        ;[rulesOrder, styleMap] = getStyleMap(current, scope, rulesOrder, styleMap)
        scope.pop()
      }
    }

    if (current.type === ASTType.CSSStyleDeclaration) {
      styleMap[scope.join(' ')][current.prop!] = current.value!
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
