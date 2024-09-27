import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
const relTime = (value) => {
  return dayjs().locale('zh-cn').from(value)
}

export default {
  install (Vue) {
    Vue.filter('relTime', relTime)
  }
}
