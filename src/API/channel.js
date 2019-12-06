// 文章相关接口
import request from '@/utils/request'
// 获取用户频道
export const getChannel = () => {
  return request('/app/v1_0/user/channels', 'get')
}
// 获取全部频道
export const getAllChannels = () => {
  return request('app/v1_0/channels', 'get')
}
