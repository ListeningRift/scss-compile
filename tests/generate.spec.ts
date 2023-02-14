import generate, { getStyleMap } from '../packages/generate'
import { ASTType } from '../packages/parse'

describe('generate tests', () => {
  const cases = [
    {
      CSSText: '.app {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['.app'],
      styleMap: {
        '.app': {
          color: 'red'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.rule,
            originText: '.app',
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
    },
    {
      CSSText: '#app:hover {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['#app:hover'],
      styleMap: {
        '#app:hover': {
          color:'red'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.rule,
            originText: '#app:hover',
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
    },
    {
      CSSText: '#app::after {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['#app::after'],
      styleMap: {
        '#app::after': {
          color: 'red'
        }
      },
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.rule,
            originText: '#app::after',
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
    },
    {
      CSSText: '#app {\r\n  color: red;\r\n}\r\n\r\n#app .box:hover {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['#app', '#app .box:hover'],
      styleMap: {
        '#app': {
          color: 'red'
        },
        '#app .box:hover': {
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
                originText: '.box:hover',
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
      CSSText: '#app {\r\n  color: red;\r\n}\r\n\r\n#app .box1 {\r\n  color: red;\r\n}\r\n\r\n#app .box1:hover {\r\n  color: red;\r\n}\r\n\r\n#app .box2 {\r\n  color: red;\r\n}\r\n',
      rulesOrder: ['#app', '#app .box1', '#app .box1:hover', '#app .box2'],
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
        '#app .box2': {
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
                originText: '.box2',
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
      CSSText: '#app {\r\n  color: red;\r\n}\r\n\r\n#app .box {\r\n  color: blue;\r\n}\r\n',
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
    }
  ]

  test('generate:getStyleMap tests', () => {
    expect(getStyleMap(cases[0].AST)).toEqual([cases[0].rulesOrder, cases[0].styleMap])

    expect(getStyleMap(cases[1].AST)).toEqual([cases[1].rulesOrder, cases[1].styleMap])

    expect(getStyleMap(cases[2].AST)).toEqual([cases[2].rulesOrder, cases[2].styleMap])

    expect(getStyleMap(cases[3].AST)).toEqual([cases[3].rulesOrder, cases[3].styleMap])

    expect(getStyleMap(cases[4].AST)).toEqual([cases[4].rulesOrder, cases[4].styleMap])

    expect(getStyleMap(cases[5].AST)).toEqual([cases[5].rulesOrder, cases[5].styleMap])
  })

  test('generate:generate tests', () => {
    expect(generate(cases[0].AST)).toBe(cases[0].CSSText)

    expect(generate(cases[1].AST)).toBe(cases[1].CSSText)

    expect(generate(cases[2].AST)).toBe(cases[2].CSSText)

    expect(generate(cases[3].AST)).toBe(cases[3].CSSText)

    expect(generate(cases[4].AST)).toBe(cases[4].CSSText)

    expect(generate(cases[5].AST)).toBe(cases[5].CSSText)
  })
})
