import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

// 包装一个xhr方法
// 包装为 Promise
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      vaildateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvent()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest(): void {
      // 定义响应类型
      if (responseType) {
        request.responseType = responseType
      }

      // 配置超时
      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvent(): void {
      // 当请求被发送到服务器时，执行一些基于响应的任务。
      request.onreadystatechange = function handleLoad() {
        // 0: 请求未初始化
        // 1: 服务器连接已建立
        // 2: 请求已接收
        // 3: 请求处理中
        // 4: 请求已完成，且响应已就绪
        // !==4 没有被正确接受
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }

        // 请求已经完成 且响应就绪
        // 返回所有响应头 并转义成对象
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        // 设置返回数据的类型
        const responseData = responseType !== 'text' ? request.response : request.responseText
        // 设置返回数据
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        // 返回请求成功数据
        handleResponse(response)
      }

      // 网络操作
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      // 遍历 headers
      Object.keys(headers).forEach(name => {
        // 请求数据不存在 且有 content-type 参数
        // 删除
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          // catch 捕获
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!vaildateStatus || vaildateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed width status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
