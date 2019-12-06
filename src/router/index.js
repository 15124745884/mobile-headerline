import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/home/index.vue'),
        meta: { isKeepLive: true }
      },
      { path: '/video', component: () => import('@/views/video/index.vue') },
      {
        path: '/question',
        component: () => import('@/views/question/index.vue')
      },
      { path: '/user', component: () => import('@/views/user/index.vue') }
    ]
  },
  {
    path: '/user/profile',
    component: () => import('@/views/user/Profile.vue')
  },
  { path: '/user/chat', component: () => import('@/views/user/Chat.vue') },
  { path: '/login', component: () => import('@/views/user/Login.vue') },
  { path: '/search', component: () => import('@/views/search/Search.vue') },
  {
    path: '/search/result',
    component: () => import('@/views/search/SearchRes.vue')
  },
  {
    path: '/article/:id',
    component: () => import('@/views/home/Article.vue'),
    meta: { isKeepLive: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = store.state.user
  const loginConfig = { path: '/login', query: { redirectUrl: to.path } }
  if (to.path.startsWith('/user') && !user.token) return next(loginConfig)
  next()
})

export default router
