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
