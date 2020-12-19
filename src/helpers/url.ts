import { isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

// 编码
function encode(val: string): string {
  // encodeUROComponent 转义字符
  // 将转义的字符替换
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  // 如果参数为空 直接返回url
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    // 定义数组存放参数
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      // 获取参数的键
      const val = params[key]
      // 如果空 或者 undefined 直接返回
      if (val === null || typeof val === 'undefined') {
        return
      }
      // 定义一个数组 判断参数是否为数组
      let values = []
      // 如果是数组
      if (Array.isArray(val)) {
        values = val
        // key 转换为 key[]的形式
        key += '[]'
      } else {
        // 不是数组 编程数组
        values = [val]
      }
      // 对上面的数组便利
      values.forEach(val => {
        // 判断是不是日期
        if (isDate(val)) {
          // 格式话时间
          val = val.toISOString()
        } // 判断是不是普通对象
        else if (isPlainObject(val)) {
          // 普通对象转化为字符串
          val = JSON.stringify(val)
        }
        // 拼接参数
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
  }

  // 判断参数是否存在
  if (serializedParams) {
    // 去出哈希字段
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断url是否已经有参数了
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  // 返回修改后的url
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

// DOM 对象
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
