import store from '@/store'
// 文章相关接口
import request from '@/utils/request'
const KEY = 'hm-toutiao-m-86-channel'
// 获取用户频道
export const getChannel = () => {
  // 1. 登录状态：获取后台我的频道数据
  // 2. 未登录状态：
  // 2.1 本地没有存储频道数据，获取默认的频道数据，存储在本地
  // 2.2 本地已经存储频道数据，使用本地数据即可
  return new Promise(async (resolve, reject) => {
    let { user } = store.state
    if (user.token) {
      const data = await request('/app/v1_0/user/channels', 'get')
      resolve(data)
    } else {
      const localChannels = JSON.parse(window.localStorage.getItem(KEY)) || []
      if (!localChannels.length) {
        const data = await request('/app/v1_0/user/channels', 'get')
        window.localStorage.setItem(KEY, JSON.stringify(data.channels))
        resolve(data)
      } else {
        resolve({ channels: localChannels })
      }
    }
  })
}
// 删除频道
export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { user } = store.state
      if (user.token) {
        await request(`/app/v1_0/user/channels/${channelId}`, 'delete')
        resolve()
      } else {
        const localChannels = JSON.parse(window.localStorage.getItem(KEY)) || []
        const index = localChannels.findIndex(item =>
          item.id === channelId
        )
        localChannels.splice(index, 1)
        window.localStorage.setItem(KEY, JSON.stringify(localChannels))
        resolve()
      }
    } catch (error) {
      reject(error)
    }
  })
}
// 添加频道
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      await request('/app/v1_0/user/channels', 'put', {
        channels: orderChannels
      })
      resolve()
    } else {
      const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      const { id, name } = orderChannels[orderChannels.length - 1]
      localChannels.push({ id, name })
      window.localStorage.setItem(KEY, JSON.stringify(localChannels))
      resolve()
    }
  })
}
// 获取全部频道
export const getAllChannels = () => {
  return request('app/v1_0/channels', 'get')
}
