<template>
  <view class="container">
    <image :src="banner" class="banner" mode="widthFix"/>
    <view class="help" @tap="goToHelp">
      <view>产品介绍</view>
      <van-icon name="arrow"/>
    </view>
    <van-button custom-class="contact" hairline="true" open-type="contact"
                plain="true" send-message-img="https://static.runoob.com/images/demo/demo3.jpg"
                send-message-path="/pages/help/index?task=1001"
                send-message-title="卡片消息"
                session-from="task-1001" show-message-card="true" size="small" type="info">
      在线客服
    </van-button>
    <van-skeleton :loading="loading" avatar="true" row="5" title="true">
      <van-tabs :sticky="sticky" class="tabs" color="#3865FF" swipeable="true" title-active-color="#3865FF"
                @change="onChange">
        <van-tab title="下跌9信号">
          <table-view
            :border="border"
            :data="downSignals"
            :headers="tableHeader"
            :stripe="stripe"
            cell-class-name="cell"
          />
        </van-tab>
        <van-tab title="上涨9信号">
          <table-view
            :border="border"
            :data="upSignals"
            :headers="tableHeader"
            :stripe="stripe"
            cell-class-name="cell"
          />
        </van-tab>
      </van-tabs>
    </van-skeleton>
  </view>
</template>

<script>
import './index.scss'
import banner from '../../images/banner@2x.jpg'
import Taro from "@tarojs/taro";

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      sticky: false,
      banner: banner,
      tableHeader: [
        {
          prop: 'name',
          width: 150,
          label: '股票名称',
          // color: '#55C355'
        },
        {
          prop: 'code',
          width: 150,
          label: '股票代码',
        },
        {
          prop: 'trigger_date',
          width: 150,
          label: '信号日期'
        },
        {
          prop: 'price',
          width: 150,
          label: '信号价格'
        },
        {
          prop: 'rise_rate',
          width: 150,
          label: '累计涨幅'
        }
      ],
      stripe: true,
      border: true,
      outBorder: true,
      downSignals: [],
      upSignals: [],
      msg: '暂无数据'
    }
  },
  created() {
    this.getSignals('down')
    // this.getSignals('up')

    Taro.cloud
      .callFunction({
        name: "get_tiktok_video_link",
        data: {
          url: 'https://v.douyin.com/JTDm8hm/'
        }
      })
      .then(res => {
        console.log(res.result.title)
        console.log(res.result.videoUrl)
      })
  },
  methods: {
    getSignals(type) {
      this.loading = true
      const db = Taro.cloud.database({
        env: 'super9-8g00mp8j1629520a'
      })
      const _ = db.command
      db.collection('signals')
        .field({
          name: true,
          code: true,
          price: true,
          trigger_date: true,
          rise_rate: true
        })
        .where({
          type: type
        })
        .skip(0)
        .limit(1000)
        .orderBy('trigger_date', 'desc')
        .get()
        .then(res => {
          this.loading = false
          this.sticky = true
          if (type === 'up') {
            this.upSignals = res.data
          } else {
            this.downSignals = res.data
          }
        })
        .catch(err => {
          this.loading = false
          this.sticky = true
          console.error(err)
        })
    },
    goToHelp() {
      Taro.navigateTo({
        url: '/pages/help/index'
      })
    },
    onChange(event) {
      if (event.detail.index === 1 && this.upSignals.length <= 0) {
        this.getSignals('up')
      }
    }
  }
}
</script>
