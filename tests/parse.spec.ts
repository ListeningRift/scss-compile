import parse, { tokenize, ASTType, transformAST } from '../packages/parse'

describe('parse tests', () => {
  const cases = [
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

          .box2::after {
            color: red;
          }
        }
      `,
      tokenList: [
        '#app',
        '{',
        'color',
        ':',
        'red',
        ';',
        '.box1',
        '{',
        'color',
        ':',
        'red',
        ';',
        '&',
        ':',
        'hover',
        '{',
        'color',
        ':',
        'red',
        ';',
        '}',
        '}',
        '.box2',
        '::',
        'after',
        '{',
        'color',
        ':',
        'red',
        ';',
        '}',
        '}'
      ],
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
      CSSText: `
        $color: red;

        #app {
          color: $color;

          $color: blue;

          .box {
            color: $color;
          }
        }
      `,
      tokenList: [
        '$color',
        ':',
        'red',
        ';',
        '#app',
        '{',
        'color',
        ':',
        '$color',
        ';',
        '$color',
        ':',
        'blue',
        ';',
        '.box',
        '{',
        'color',
        ':',
        '$color',
        ';',
        '}',
        '}'
      ],
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
      CSSText: `
        @mixin backgroundMixin {
          background: yellow;
        }

        #app {
          @include backgroundMixin;

          @mixin backgroundMixin {
            background: blue;
          }

          .box {
            @include backgroundMixin;
          }
        }
      `,
      tokenList: [
        '@mixin',
        'backgroundMixin',
        '{',
        'background',
        ':',
        'yellow',
        ';',
        '}',
        '#app',
        '{',
        '@include',
        'backgroundMixin',
        ';',
        '@mixin',
        'backgroundMixin',
        '{',
        'background',
        ':',
        'blue',
        ';',
        '}',
        '.box',
        '{',
        '@include',
        'backgroundMixin',
        ';',
        '}',
        '}'
      ],
      AST: {
        type: ASTType.styleSheet,
        originText: '',
        body: [
          {
            type: ASTType.mixinDeclaration,
            originText: 'backgroundMixin',
            body: [
              {
                type: ASTType.styleDeclaration,
                originText: 'background:yellow',
                prop: 'background',
                value: 'yellow'
              }
            ]
          },
          {
            type: ASTType.rule,
            originText: '#app',
            body: [
              {
                type: ASTType.includeDeclaration,
                originText: 'backgroundMixin'
              },
              {
                type: ASTType.mixinDeclaration,
                originText: 'backgroundMixin',
                body: [
                  {
                    type: ASTType.styleDeclaration,
                    originText: 'background:blue',
                    prop: 'background',
                    value: 'blue'
                  }
                ]
              },
              {
                type: ASTType.rule,
                originText: '.box',
                body: [
                  {
                    type: ASTType.includeDeclaration,
                    originText: 'backgroundMixin'
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
  })

  test('parse:transformAST tests', () => {
    expect(transformAST(cases[0].tokenList)).toEqual(cases[0].AST)

    expect(transformAST(cases[1].tokenList)).toEqual(cases[1].AST)

    expect(transformAST(cases[2].tokenList)).toEqual(cases[2].AST)
  })

  test('parse:parse tests', () => {
    expect(parse(cases[0].CSSText)).toEqual(cases[0].AST)

    expect(parse(cases[1].CSSText)).toEqual(cases[1].AST)

    expect(parse(cases[2].CSSText)).toEqual(cases[2].AST)
  })
})
