import parse, { tokenize, ASTType, transformAST } from '../packages/parse'

describe('parse tests', () => {
  const cases = [
    {
      CSSText: `
        .app {
          color: red;
        }
      `,
      tokenList: ['.app', '{', 'color', ':', 'red', ';', '}'],
      AST: {
        type: ASTType.StyleSheet,
        originText: '',
        body: [
          {
            type: ASTType.CSSStyleRule,
            originText: '.app',
            body: [
              {
                type: ASTType.CSSStyleDeclaration,
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
      CSSText: `
        #app:hover {
          color: red;
        }
      `,
      tokenList: ['#app', ':', 'hover', '{', 'color', ':', 'red', ';', '}'],
      AST: {
        type: ASTType.StyleSheet,
        originText: '',
        body: [
          {
            type: ASTType.CSSStyleRule,
            originText: '#app:hover',
            body: [
              {
                type: ASTType.CSSStyleDeclaration,
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
      CSSText: `
        #app::after {
          color: red;
        }
      `,
      tokenList: ['#app', '::', 'after', '{', 'color', ':','red', ';', '}'],
      AST: {
        type: ASTType.StyleSheet,
        originText: '',
        body: [
          {
            type: ASTType.CSSStyleRule,
            originText: '#app::after',
            body: [
              {
                type: ASTType.CSSStyleDeclaration,
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
      CSSText: `
        #app {
          color: red;

          .box:hover {
            color: red;
          }
        }
      `,
      tokenList: ['#app', '{', 'color', ':','red', ';', '.box', ':', 'hover', '{', 'color', ':', 'red', ';', '}', '}'],
      AST: {
        type: ASTType.StyleSheet,
        originText: '',
        body: [
          {
            type: ASTType.CSSStyleRule,
            originText: '#app',
            body: [
              {
                type: ASTType.CSSStyleDeclaration,
                originText: 'color:red',
                prop: 'color',
                value: 'red'
              },
              {
                type: ASTType.CSSStyleRule,
                originText: '.box:hover',
                body: [
                  {
                    type: ASTType.CSSStyleDeclaration,
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
      CSSText: `
        #app {
          color: red;

          .box1 {
            color: red;

            &:hover {
              color: red;
            }
          }

          .box2 {
            color: red;
          }
        }
      `,
      tokenList: ['#app', '{', 'color', ':','red', ';', '.box1', '{', 'color', ':', 'red', ';', '&', ':', 'hover', '{', 'color', ':', 'red', ';', '}', '}', '.box2', '{', 'color', ':', 'red', ';', '}', '}'],
      AST: {
        type: ASTType.StyleSheet,
        originText: '',
        body: [
          {
            type: ASTType.CSSStyleRule,
            originText: '#app',
            body: [
              {
                type: ASTType.CSSStyleDeclaration,
                originText: 'color:red',
                prop: 'color',
                value: 'red'
              },
              {
                type: ASTType.CSSStyleRule,
                originText: '.box1',
                body: [
                  {
                    type: ASTType.CSSStyleDeclaration,
                    originText: 'color:red',
                    prop: 'color',
                    value: 'red'
                  },
                  {
                    type: ASTType.CSSStyleRule,
                    originText: '&:hover',
                    body: [
                      {
                        type: ASTType.CSSStyleDeclaration,
                        originText: 'color:red',
                        prop: 'color',
                        value: 'red'
                      }
                    ]
                  }
                ]
              },
              {
                type: ASTType.CSSStyleRule,
                originText: '.box2',
                body: [
                  {
                    type: ASTType.CSSStyleDeclaration,
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
    }
  ]

  test('parse:tokenize tests', () => {
    expect(tokenize(cases[0].CSSText)).toEqual(cases[0].tokenList)

    expect(tokenize(cases[1].CSSText)).toEqual(cases[1].tokenList)

    expect(tokenize(cases[2].CSSText)).toEqual(cases[2].tokenList)

    expect(tokenize(cases[3].CSSText)).toEqual(cases[3].tokenList)

    expect(tokenize(cases[4].CSSText)).toEqual(cases[4].tokenList)
  })

  test('parse:transformAST tests', () => {
    expect(transformAST(cases[0].tokenList)).toEqual(cases[0].AST)

    expect(transformAST(cases[1].tokenList)).toEqual(cases[1].AST)

    expect(transformAST(cases[2].tokenList)).toEqual(cases[2].AST)

    expect(transformAST(cases[3].tokenList)).toEqual(cases[3].AST)

    expect(transformAST(cases[4].tokenList)).toEqual(cases[4].AST)
  })

  test('parse:parse tests', () => {
    expect(parse(cases[0].CSSText)).toEqual(cases[0].AST)

    expect(parse(cases[1].CSSText)).toEqual(cases[1].AST)

    expect(parse(cases[2].CSSText)).toEqual(cases[2].AST)

    expect(parse(cases[3].CSSText)).toEqual(cases[3].AST)

    expect(parse(cases[4].CSSText)).toEqual(cases[4].AST)
  })
})
