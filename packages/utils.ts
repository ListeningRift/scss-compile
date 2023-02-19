export function trim(value: string): string {
  return value.replace(/^\s+|\s+$/g, '')
}

export function getProperty(obj: any, keys: number[]): any[] {
  for (let i in keys) {
    obj = obj.body[keys[i]] ?? {
      body: []
    }
  }
  return obj.body
}

export function getPaths(levelArr: string[]): string[] {
  return levelArr.reduce((prev: string[], curr: string) => {
    let res: string[] = []
    curr.split(',').forEach(currentLevel => {
      if (prev.length) {
        res = res.concat(prev.map(prevLevel => {
          if (!currentLevel.includes('&')) {
            return prevLevel + ' ' + currentLevel
          } else {
            return currentLevel.replace(/\&/g, prevLevel)
          }
        }))
      } else {
        res.push(currentLevel)
      }
    })
    return res
  }, [])
}
