import { isPlainObject } from './utils'

// 如果参数是普通对象
// 就其转化为字符串
// 否则返回数据
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 默认将响应的数据转为 JSON
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
