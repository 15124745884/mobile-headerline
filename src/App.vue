<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.isKeepLive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepLive"/>
  </div>
</template>

<style lang="less"></style>
