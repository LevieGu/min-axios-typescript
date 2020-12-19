import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'
import { AxiosRequestConfig } from './types'

// 默认合并参数
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  vaildateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

// 默认配置
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

// 添加默认的表单参数
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// headers: {
//     common: {Accept: "application/json, text/plain, */*"}
//     delete: {}
//     get: {}
//     head: {}
//     options: {}
//     patch: {Content-Type: "application/x-www-form-urlencoded"}
//     post: {Content-Type: "application/x-www-form-urlencoded"}
//     put: {Content-Type: "application/x-www-form-urlencoded"}
// }

export default defaults
