import { relative } from 'path'

const toString = Object.prototype.toString

// 判断是否为时间
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//     return val !== null && typeof val === 'object';
// }

// 判断是否为普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深拷贝
export function deepMerge(...objs: any[]): any {
  // 创建一个空对象接受参数
  // result = {}
  const result = Object.create(null)
  // 遍历对象
  objs.forEach(obj => {
    // 子元素是否存在
    if (obj) {
      // 遍历子对象
      Object.keys(obj).forEach(key => {
        // 获取孙元素
        const val = obj[key]
        // 判断孙元素是否是对象
        if (isPlainObject(val)) {
          // 判断 result 中是否有 匹配键值
          if (isPlainObject(result[key])) {
            // 合并键值
            result[key] = deepMerge(result[key], val)
          } else {
            // 生产新的 result[key]
            result[key] = deepMerge({}, val)
          }
        } else {
          // 如果子元素不是对象 直接加入
          result[key] = val
        }
      })
    }
  })
  return result
}

// 判断 form data
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
