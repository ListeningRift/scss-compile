import { AST, ASTType } from './parse'
import os from 'os'
import { getPaths } from './utils'

interface Scope {
  variable: Record<string, string>,
  mixin: Record<string, AST>,
  content: Record<string, AST>
}

export function getStyleMap(
  ast: AST,
  level: string[] = [],
  scope: Scope = {
    variable: {},
    mixin: {},
    content: {}
  },
  rulesOrder: string[] = [],
  styleMap: Record<string, Record<string, string>> = {},
  minify = false
): [string[], Record<string, Record<string, string>>] {
  for (let i = 0; i < ast.body!.length; i++) {
    const current = ast.body![i]

    if (current.type === ASTType.rule) {
      level.push(current.originText)
      ;[rulesOrder, styleMap] = getStyleMap(current, level, JSON.parse(JSON.stringify(scope)), rulesOrder, styleMap, minify)
      level.pop()
    } else if (current.type === ASTType.styleDeclaration) {
      let value: string
      if (current.value!.startsWith('$')) {
        value = scope.variable[current.value!]
      } else {
        value = current.value!
      }

      const path = getPaths(level).join(',' + (minify ? '' : ' '))
      if (styleMap[path]) {
        styleMap[path][current.prop!] = value
      } else {
        styleMap[path] = { [current.prop!]: value }
        rulesOrder.push(path)
      }
    } else if (current.type === ASTType.variableDeclaration) {
      scope.variable[current.prop!] = current.value!
    } else if (current.type === ASTType.mixinDeclaration) {
      scope.mixin[current.originText] = current
    } else if (current.type === ASTType.includeDeclaration) {
      const tempScope = JSON.parse(JSON.stringify(scope))

      scope.mixin[current.originText].params!.forEach((param, index) => {
        tempScope.variable[param] = current.params![index]
      })

      tempScope.content[current.originText] = current

      ;[rulesOrder, styleMap] = getStyleMap(scope.mixin[current.originText], level, tempScope, rulesOrder, styleMap, minify)
    } else if (current.type === ASTType.contentDeclaration) {
      [rulesOrder, styleMap] = getStyleMap(scope.content[ast.originText], level, JSON.parse(JSON.stringify(scope)), rulesOrder, styleMap, minify)
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
  const [rulesOrder, styleMap] = getStyleMap(ast, undefined, undefined, undefined, undefined, minify)

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
