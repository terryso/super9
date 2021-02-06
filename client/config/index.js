import path from "path"

const config = {
  projectName: 'super9',
  date: '2021-1-26',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@/vant': path.resolve(__dirname, '../src/components/vant-weapp/dist'),
    '@/components': path.resolve(__dirname, '../src/components')
  },
  copy: {
    patterns: [
      {from: 'sitemap.json', to: 'dist/sitemap.json'},
      {from: 'src/components/vant-weapp/dist/wxs', to: 'dist/components/vant-weapp/dist/wxs'},
      {from: 'src/components/vant-weapp/dist/sticky/index.wxs', to: 'dist/components/vant-weapp/dist/sticky/index.wxs'},
      {from: 'src/components/vant-weapp/dist/tabs/index.wxs', to: 'dist/components/vant-weapp/dist/tabs/index.wxs'},
      {from: 'src/components/vant-weapp/dist/common/style', to: 'dist/components/vant-weapp/dist/common/style'},
      {
        from: 'src/components/vant-weapp/dist/common/index.wxss',
        to: 'dist/components/vant-weapp/dist/common/index.wxss'
      },
      {
        from: 'src/components/vant-weapp/dist/calendar/index.wxs',
        to: 'dist/components/vant-weapp/dist/calendar/index.wxs'
      },
      {
        from: 'src/components/vant-weapp/dist/calendar/utils.wxs',
        to: 'dist/components/vant-weapp/dist/calendar/utils.wxs'
      },
      {
        from: 'src/components/vant-weapp/dist/calendar/calendar.wxml',
        to: 'dist/components/vant-weapp/dist/calendar/calendar.wxml'
      },
      {
        from: 'src/components/vant-weapp/dist/calendar/components/month/index.wxs',
        to: 'dist/components/vant-weapp/dist/calendar/components/month/index.wxs'
      },
    ],
    options: {}
  },
  framework: 'vue',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/van-/]
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
