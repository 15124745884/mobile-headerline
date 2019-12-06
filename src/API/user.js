import request from '@/utils/request.js'

export const login1 = (loginForm) => {
  return request('/app/v1_0/authorizations', 'post', loginForm)
}
