// 公共类型定义文件

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

// 请求参数
export interface AxiosRequestConfig {
  // url 可选 拓展 Axios 接口
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  vaildateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
  [propName: string]: any
}

// 返回结果
// 泛型支持
export interface AxiosResponse<T = any> {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// Promise 化
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// Axios 错误增强
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 拓展接口
export interface Axios {
  // Axios 对外抛出的借口用

  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  // put 和 post的区别 put 等幂 的！！！
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  // 对资源进行部分修改
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

// AxiosInstanc 混合对象
// AxiosInstanc 继承 Axios
export interface AxiosInstance extends Axios {
  // 拥有两个构造函数
  // 第一种： 直接传入 AxiosRequestConfig 参数
  // 第二种： 单独传入 url 参数 以及 分开传送 AxiosRequestConfig
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

// 拦截器相关定义
export interface AxiosInterceptorManager<T> {
  // number 拦截器 id 用于移除拦截器
  use(resolved: ResolveFn<T>, rejected?: RejectedFn): number
  // 移除拦截器
  eject(id: number): void
}

// 回调成功函数
export interface ResolveFn<T = any> {
  // T 同步逻辑
  // Promise 异步逻辑
  (val: T): T | Promise<T>
}

// 回调失败函数
export interface RejectedFn {
  (error: any): any
}

// 数据发送到服务器之前调整
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// 静态方法拓展
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  // 取消
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promise: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

  Axios: AxiosClassStatic
}

// 取消请求配置
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequest(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
