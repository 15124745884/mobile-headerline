# 混合app

## 每日资讯，由vue-cli搭建，基于vue，vuex，接口地址 http://ttapi.research.itcast.cn/app/ 

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的**规则**保证状态以一种可预测的方式发生变化。

###使用技术

-  生产依赖
   - vuejs  核心vue
   - vuex  状态管理插件
   - vue-router  路由插件
   - axios  请求插件
   - json-bigint 最大安全数值处理
   - socket.io-client  即时通讯库
   - vant 移动组件库
   - amfe-flexible  rem适配
   - vue-lazyload 图片懒加载
-  开发依赖
   - babel  ES转换器
   - less  css预处理器
   - postcss  css后处理器
   - vue-cli  vue项目脚手架
-  打包App
   - H5+  native接口
   - DCLOUD 打包

### vuex-初始化功能

#### 初始化：

- 第一步：`npm i vuex --save`
- 第二步： 创建store.js  `import vuex from 'vuex'`  `import vue from 'vue'`
- 第三步：`Vue.use(vuex)`
- 第四步：`const store = new Vuex.Store({...配置项})`
- 第五步：导出 `export default store`
- 第六步：导入main.js 在根实例配置 store 选项指向 store 实例对象

##### 目前只做了首页模块，有上拉加载，下拉刷新，频道管理，不感兴趣功能，还在完善当中。

