import generate, { getStyleMap } from '../packages/generate'
import { ASTType } from '../packages/parse'

describe('generate tests', () => {
  const cases = [
    {
      CSSText: '#app {\r\n  color: red;\r\n}\r\n\r\n#app .box1 {\r\n  color: red;\r\n}\r\n\r\n#app .box1:hover {\r\n  color: red;\r\n}\r\n\r\n#app .box2::after {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['#app', '#app .box1', '#app .box1:hover', '#app .box2::after'],
      styleMap: {
        '#app': {
          color: 'red'
        },
        '#app .box1': {
          color: 'red'
        },
        '#app .box1:hover': {
          color: 'red'
        },
        '#app .box2::after': {
          color: 'red'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.rule,
            originText: '#app',
            body: [
              {
                type: ASTType.styleDeclaration,
                originText: 'color:red',
                prop: 'color',
                value: 'red'
              },
              {
                type: ASTType.rule,
                originText: '.box1',
                body: [
                  {
                    type: ASTType.styleDeclaration,
                    originText: 'color:red',
                    prop: 'color',
                    value: 'red'
                  },
                  {
                    type: ASTType.rule,
                    originText: '&:hover',
                    body: [
                      {
                        type: ASTType.styleDeclaration,
                        originText: 'color:red',
                        prop: 'color',
                        value: 'red'
                      }
                    ]
                  }
                ]
              },
              {
                type: ASTType.rule,
                originText: '.box2::after',
                body: [
                  {
                    type: ASTType.styleDeclaration,
                    originText: 'color:red',
                    prop: 'color',
                    value: 'red'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      CSSText: '#app{color:red;}#app .box{color:blue;}',
      rulesOrder: ['#app', '#app .box'],
      styleMap: {
        '#app': {
          color: 'red'
        },
        '#app .box': {
          color: 'blue'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.variableDeclaration,
            originText: '$color:red',
            prop: '$color',
            value: 'red'
          },
          {
            type: ASTType.rule,
            originText: '#app',
            body: [
              {
                type: ASTType.styleDeclaration,
                originText: 'color:$color',
                prop: 'color',
                value: '$color'
              },
              {
                type: ASTType.variableDeclaration,
                originText: '$color:blue',
                prop: '$color',
                value: 'blue'
              },
              {
                type: ASTType.rule,
                originText: '.box',
                body: [
                  {
                    type: ASTType.styleDeclaration,
                    originText: 'color:$color',
                    prop: 'color',
                    value: '$color'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      CSSText: '#app{color:yellow;background-color:yellow;width:14px;font-size:14px;}',
      rulesOrder: ['#app'],
      styleMap: {
        '#app': {
          color: 'yellow',
          'background-color': 'yellow',
          width: '14px',
          'font-size': '14px'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.mixinDeclaration,
            originText: 'widthMixin',
            params: ['$width'],
            body: [
              {
                type: ASTType.styleDeclaration,
                originText: 'width:$width',
                prop: 'width',
                value: '$width'
              },
              {
                type: ASTType.contentDeclaration,
                originText: '@content'
              }
            ]
          },
          {
            type: ASTType.mixinDeclaration,
            originText: 'colorMixin',
            params: ['$color'],
            body: [
              {
                type: ASTType.styleDeclaration,
                originText: 'color:$color',
                prop: 'color',
                value: '$color'
              },
              {
                type: ASTType.contentDeclaration,
                originText: '@content'
              }
            ]
          },
          {
            type: ASTType.rule,
            originText: '#app',
            body: [
              {
                type: ASTType.includeDeclaration,
                originText: 'colorMixin',
                params: ['yellow'],
                body: [
                  {
                    type: ASTType.styleDeclaration,
                    originText: 'background-color:yellow',
                    prop: 'background-color',
                    value: 'yellow'
                  },
                  {
                    type: ASTType.includeDeclaration,
                    originText: 'widthMixin',
                    params: ['14px'],
                    body: [
                      {
                        type: ASTType.styleDeclaration,
                        originText: 'font-size:14px',
                        prop: 'font-size',
                        value: '14px'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]

  test('generate:getStyleMap tests', () => {
    expect(getStyleMap(cases[0].AST)).toEqual([cases[0].rulesOrder, cases[0].styleMap])

    expect(getStyleMap(cases[1].AST)).toEqual([cases[1].rulesOrder, cases[1].styleMap])

    expect(getStyleMap(cases[2].AST)).toEqual([cases[2].rulesOrder, cases[2].styleMap])
  })

  test('generate:generate tests', () => {
    expect(generate(cases[0].AST)).toBe(cases[0].CSSText)

    expect(generate(cases[1].AST, true)).toBe(cases[1].CSSText)

    expect(generate(cases[2].AST, true)).toBe(cases[2].CSSText)
  })
})
