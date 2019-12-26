const USER_KEY = 'meiri-m-user'
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
