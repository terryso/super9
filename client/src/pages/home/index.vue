<template>
  <view class="create-wrap">
    <view class="link-wrap">
      <view class="h">
        <view class="title">视频链接</view>
        <view class="r">
          <view class="brief" @tap="getHelp">如何获取链接</view>
          <view class="ds-icon ds-more"></view>
        </view>
      </view>
      <textarea
        ref="textarea"
        v-model="originVideoLink"
        class="input-link"
        placeholder="请粘贴抖音视频链接"
        type="text">
      </textarea>
      <view class="operate-wrap">
        <view class="paste" @tap="pasteLink">粘贴</view>
        <view v-if="originVideoLink" class="clear" @tap="clearLink">清空</view>
      </view>
    </view>
    <button :class="canSave ? 'save': ''" class="no-save" @tap="getVideoLink">开始解析</button>
    <button class="no-save contact" open-type="contact">联系客服</button>
    <view v-if="videoLink" class="preview">
      <video :src="videoLink" show-casting-button="true"/>
      <button class="no-save save" @tap="downloadVideo">下载视频</button>
      <button class="no-save copy-link" @tap="copyVideoLink">复制链接</button>
    </view>
    <van-toast id="van-toast"/>
  </view>
</template>

<script>
import './index.scss'
import Taro from "@tarojs/taro";
import Toast from "../../components/vant-weapp/dist/toast/toast";

export default {
  name: 'Index',
  data() {
    return {
      originVideoLink: '',
      videoLink: ''
    }
  },
  created() {
  },
  methods: {
    extractVideoUrl() {
      let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
      let match = reg.exec(this.originVideoLink)
      return match ? match[0] : '';
    },
    getVideoLink() {
      if (!this.canSave) {
        return
      }

      Toast.loading({
        message: '分析中...',
        forbidClick: true,
        duration: 0,
        mask: true
      })
      this.videoLink = ''
      Taro.cloud
        .callFunction({
          name: "get_tiktok_video_link",
          data: {
            url: this.extractVideoUrl()
          }
        })
        .then(res => {
          if (res.result.error === '0') {
            console.log(res.result.title)
            console.log(res.result.videoUrl)
            this.videoLink = res.result.videoUrl
            Toast.clear()
          } else {
            Toast.fail('解析失败')
          }
        }, rej => {
          console.log(rej)
          Toast.fail('不支持该链接')
        })
    },
    pasteLink() {
      Taro.getClipboardData().then(res => {
        console.log(res.data)
        this.originVideoLink = res.data
      })
    },
    clearLink() {
      this.originVideoLink = ''
    },
    copyVideoLink() {
      Taro.setClipboardData({
        data: this.videoLink
      })
    },
    downloadVideo() {
      Toast.loading({
        message: '下载中...',
        forbidClick: true,
        duration: 0,
        mask: true
      })

      let userAgent = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3329.0 Mobile Safari/537.36'

      Taro.downloadFile({
        url: this.videoLink,
        header: {
          'User-Agent': userAgent
        },
        success: function (res) {
          if (res.statusCode === 200) {
            Taro.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log(res)
                Toast.success('保存成功')
              },
              fail: function (res) {
                console.log(res)
                Toast.fail('保存失败')
              }
            })
          }
        },
        fail: function (res) {
          console.log(res)
          Toast.fail('下载失败')
        }
      })
    },
    getHelp() {
      Taro.navigateTo({
        url: '/pages/help/index'
      })
    }
  },
  computed: {
    canSave() {
      return this.extractVideoUrl() !== ''
    }
  },
  onShareAppMessage(options) {
    return {
      title: '短视频水印杀手, 无广告, 全网最简洁的去水印工具',
      path: '/pages/home/index'
    }
  },
  onShareTimeline() {
    return {
      title: '短视频水印杀手, 无广告, 全网最简洁的去水印工具',
      path: '/pages/home/index'
    }
  }
}
</script>
