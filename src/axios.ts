import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// 混合对象
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 绑定 this
  const instance = Axios.prototype.request.bind(context)
  // 拓展对象
  extend(instance, context)
  // 抛出 AxiosInstance 实例
  return instance as AxiosStatic
}

// 有默认参数的实例 AxiosStatic
const axios = createInstance(defaults)

// 新的 axios 实例
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promise) {
  return Promise.all(promise)
}

axios.spread = function spread(callback) {
  return function warp(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

// 对外抛出一个 AxiosInstance 实例
export default axios
