import request from '@/utils/request'
// 获取文章
export const getArticles = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
// 不感兴趣
export const disLikes = (articleID) => {
  return request('/app/v1_0/article/dislikes', 'POST', {
    target: articleID
  })
}
// 举报
export const report = (artId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: artId,
    type: type
  })
}
