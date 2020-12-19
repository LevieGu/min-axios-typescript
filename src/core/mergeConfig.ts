import { isPlainObject, deepMerge } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

// 策略合并

// 定义空对象
const strats = Object.create(null)

// 默认合并
// 只要自定义的配置存在 那么就使用自定义的配置
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 第二种合并策略
// 只接受自定义配置的合并策略  如 url， params, data
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 复杂对象合并
function deepMergeStrat(val1: any, val2: any): any {
  // 先判断 自定义配置是不是 对象
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  }
  // 判断 自定义 是否存在
  else if (typeof val2 !== 'undefined') {
    return val2
  }
  // 判断 默认配置是不是 对象
  else if (isPlainObject(val1)) {
    return deepMerge(val1)
  }
  // 判断 默认 配置是否存在
  else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

// 给予合并策略 自定义
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

// 给予合并策略 复杂对象
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 合并策略函数
// config1 默认参数 ｜ config2 自定义传入的参数
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  // 如果自定义存入的参数不存在
  // 赋值一个空对象
  if (!config2) {
    config2 = {}
  }
  // 创建一个空对象 用来返回合并后的结果
  const config = Object.create(null)

  // 遍历自定义传入的 config
  for (let key in config2) {
    mergeFiled(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key: string): void {
    // 若 key 在策略中存在
    // 那么使用 key 的策略
    // 不存在使用默认策略
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
