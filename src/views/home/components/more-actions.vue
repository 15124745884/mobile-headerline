<template>
  <van-popup :value="value" @input="$emit('input', $event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="setDisLikes">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell v-for="item in reports" :key="item.value" @click="setReport(item.value)">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>
<script>
/*
  对文章不敢兴趣
  1. 定义接口API
  2. 获取点击的ID值
  3. 调用接口，将id传入
  4. 把对应文章从列表移除+提示成功+关闭对话框
  5. 失败，提示失败
*/
/*
  举报文章
  1. 定义常量数据
  2. 定义举报接口API
  3. 调用接口，将id传入
  4. 把对应文章从列表移除+提示成功+关闭对话框
  5. 失败，提示失败
*/
import { disLikes, report } from '@/API/article.js'
import { Dialog } from 'vant'
import { reports } from '@/API/constants.js'
export default {
  name: 'more-action',
  data () {
    return {
      show: false, // 显示与隐藏
      isReport: false, // 在举报或前一页
      reports
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: String,
      default: null
    }
  },
  methods: {
    async setDisLikes () {
      try {
        await disLikes(this.articleId)
        Dialog({ message: '操作成功' })
        this.$emit('input', false)
        this.$emit('delDisLike')
      } catch (error) {
        Dialog({ message: '操作失败' })
      }
    },
    async setReport (value) {
      try {
        await report(this.articleId, value)
        Dialog({ message: '操作成功' })
        this.$emit('input', false)
        this.$emit('delReport')
      } catch (error) {
        if (error.response.status === 409) {
          return Dialog({ message: '操作失败，已经举报过' })
        } else {
          Dialog({ message: '操作失败' })
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
