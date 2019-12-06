<!-- 首页 -->
<template>
  <div class="container">
    <van-tabs
      swipeable
      v-model="activeIndex"
      :lazy-render="false"
      @change="changeChannel"
    >
      <van-tab :key="item.id" v-for="item in channelList" :title="item.name">
        <div
          class="scroll-wrapper"
          @scroll="remember($event)"
          ref="scrollWrapper"
        >
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list
              v-model="activeChannel.upLoading"
              :finished="activeChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="item in activeChannel.articles"
                :key="item.art_id.toString()"
              >
                <div class="article_item">
                  <h3 class="van-ellipsis">
                    {{ item.title }}
                  </h3>
                  <div class="img_box" v-if="item.cover.type === 3">
                    <van-image
                      class="w33"
                      fit="cover"
                      lazy-load
                      :src="item.cover.images[0]"
                    />
                    <van-image
                      class="w33"
                      fit="cover"
                      lazy-load
                      :src="item.cover.images[1]"
                    />
                    <van-image
                      class="w33"
                      fit="cover"
                      lazy-load
                      :src="item.cover.images[2]"
                    />
                  </div>
                  <div class="img_box" v-if="item.cover.type === 1">
                    <van-image
                      class="w100"
                      fit="cover"
                      lazy-load
                      :src="item.cover.images[0]"
                    />
                  </div>
                  <div class="info_box">
                    <span>{{ item.aut_name }}</span>
                    <span>{{ item.comm_count }}评论</span>
                    <span>{{ item.pubdate | relTime }}</span>
                    <span
                      class="close"
                      v-if="user.token"
                      @click.stop="openMore(item.art_id.toString())"
                    >
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right" @click="showEdit">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <more-actions
      v-if="user.token"
      :value="showMore"
      :articleId="articleId"
      @input="showMore = $event"
      @delDisLike="removeArticle"
      @delReport="removeArticle"
    ></more-actions>
    <chennle-edit
      v-model="showChennleEdit"
      :channelList="channelList"
      :activeIndex.sync="activeIndex"
    ></chennle-edit>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getChannel } from '@/API/channel'
import { getArticles } from '@/API/article'
import MoreActions from './components/more-actions'
import ChennleEdit from './components/chennle-edit'
import { mapState } from 'vuex'
export default {
  name: 'home-index',
  // import引入的组件需要注入到对象中才能使用
  components: {
    MoreActions,
    ChennleEdit
  },
  data () {
    // 这里存放数据
    return {
      articleId: null, // 要举报的文章id
      activeIndex: 0,
      refreshSuccessText: '',
      channelList: [], // 频道列表
      showMore: false, // 控制举报的显示与隐藏
      showChennleEdit: false // 控制编辑频道显示与隐藏
    }
  },
  // 监听属性 类似于data概念
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.channelList[this.activeIndex]
    },
    ...mapState(['user'])
  },
  // 监控data中的数据变化
  watch: {
    'user.refresh_token' () {
      this.activeIndex = 0
      this.getMyChannels()
      this.onLoad()
    }
  },
  // 方法集合
  methods: {
    async onLoad () {
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upLoading = false
      if (data.pre_timestamp) {
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        this.activeChannel.finished = true
      }
    },
    async onRefresh () {
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.activeChannel.downLoading = false
        this.refreshSuccessText = '更新成功'
        this.activeChannel.timestamp = data.pre_timestamp
        this.onLoad()
        this.activeChannel.finished = false
      } else {
        this.activeChannel.downLoading = false
        this.refreshSuccessText = '暂无更新'
      }
    },
    async getMyChannels () {
      const data = await getChannel()
      this.channelList = data.channels.map(item => {
        return {
          id: item.id,
          name: item.name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          scrollTop: 0
        }
      })
    },
    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    changeChannel () {
      if (!this.activeChannel.articles.length) {
        this.activeChannel.upLoading = true
        this.activeChannel.finished = false
        this.onLoad()
      } else {
        // TODO
        this.$nextTick(() => {
          const wra = this.$refs['scrollWrapper'][this.activeIndex]
          wra.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    openMore (artID) {
      this.articleId = artID
      this.showMore = true
    },
    removeArticle () {
      const index = this.activeChannel.articles.findIndex(
        item => item.art_id.toString() === this.articleId
      )
      this.activeChannel.articles.splice(index, 1)
    },
    showEdit () {
      this.showChennleEdit = true
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getMyChannels()
  },
  activated () {
    if (this.$refs['scrollWrapper']) {
      const wra = this.$refs['scrollWrapper'][this.activeIndex]
      wra.scrollTop = this.activeChannel.scrollTop
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
