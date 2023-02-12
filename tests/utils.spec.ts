import { trim, getProperty } from '../packages/utils'

describe('utils tests', () => {
  test('utils:trim tests', () => {
    expect(trim('  foo  ')).toBe('foo')

    expect(trim('  background: red;  ')).toBe('background: red;')

    expect(trim('  #app + #app  ')).toBe('#app + #app')

    expect(trim('  #app {')).toBe('#app {')

    expect(trim('background: red;  ')).toBe('background: red;')

    expect(trim('   ')).toBe('')
  })

  test('utils:getProperty tests', () => {
    const obj1 = {}
    expect(getProperty(obj1, [])).toBeUndefined()

    const res = []
    const obj2 = {
      body: [
        {
          body: res
        }
      ]
    }
    expect(getProperty(obj2, [0])).toBe(res)

    expect(getProperty(obj2, [1])).toEqual([])

    const obj3 = {
      body: [
        {
          body: []
        },
        {
          body: [
            {
              body: res
            }
          ]
        }
      ]
    }
    expect(getProperty(obj3, [1, 0])).toBe(res)
  })
})
