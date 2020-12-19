import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
// import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'
import { combineURL, isAbsoluteURL } from '../helpers/utils'

// 对 xhr 进一步处理
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 检查请求取消
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 修改传入的 config
// 使其规范化
function processConfig(config: AxiosRequestConfig): void {
  // 修改url
  config.url = transformURL(config)
  // // 修改 header 信息
  // config.headers = transformHeaders(config)
  // // 修改传入的参数
  // config.data = transformRequestData(config)
  // 使用新的合并方法
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 合并headers
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 转换url
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

// 转换发送的数据
// function transformRequestData(config: AxiosRequestConfig): any {
//     return transformRequest(config.data)
// }

// 规划化 headers
// function transformHeaders(config: AxiosRequestConfig): any {
//     const { headers = {}, data } = config
//     return processHeaders(headers, data)
// }

// 默认将 data 转化为 JSON
function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequest()
  }
}
