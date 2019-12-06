<!-- 编辑频道 -->
<template>
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
  <van-action-sheet
    :value="value"
    @input="$emit('input', $event)"
    @closed="editing = false"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button
          v-if="!editing"
          @click="editing = true"
          size="mini"
          type="info"
          plain
          >编辑</van-button
        >
        <van-button
          v-else
          @click="editing = false"
          size="mini"
          type="danger"
          plain
          >完成</van-button
        >
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item, i) in channelList" :key="item.id">
          <span class="f12" :class="{ red: activeIndex === i }" @click="enterChannel(i)">{{
            item.name
          }}</span>
          <van-icon
            v-show="editing && i !== 0"
            class="btn"
            name="cross"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionAllChannel" :key="item.id">
          <span class="f12">{{ item.name }}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getAllChannels } from '@/API/channel.js'
export default {
  name: 'chennle-edit',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      editing: false, // 控制编辑状态与完成状态
      allChannelList: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channelList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  // 监听属性 类似于data概念
  computed: {
    optionAllChannel () {
      return this.allChannelList.filter(item => this.channelList.findIndex(myitem => myitem.id === item.id) === -1)
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannelList = data.channels
    },
    enterChannel (index) {
      this.$emit('input', false)
      this.$emit('update:activeIndex', index)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getAllChannels()
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
