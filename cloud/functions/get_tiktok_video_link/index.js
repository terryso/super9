// 云函数入口文件
const cloud = require('wx-server-sdk')
const superagent = require('superagent');

cloud.init()

async function getVideoId(url) {
  let res = await superagent.get(url);
  let reg = /(\d+)/g
  const hits = [];
  let match = null;
  do {
    match = reg.exec(res.redirects[0])
    if (match) {
      hits.push(match[0])
    }
  } while (match)
  return hits ? hits[0] : ''
}

async function getVideoDetail(videoId) {
  let url = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${videoId}`
  let res = await superagent.get(url)
  let item = res.body.item_list[0]
  let originVideoUrl = item.video.play_addr.url_list[0].replace('playwm', 'play')
  let title = item.desc
  let statistics = item.statistics
  let cover = item.video.cover.url_list[0]
  return {originVideoUrl, title, statistics, cover};
}

async function getValidVideoUrl(originVideoUrl) {
  let success = false
  let videoUrl = ''
  let userAgent = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3329.0 Mobile Safari/537.36'
  let validDomains = ['v92.douyinvod.com',
    'v27.douyinvod.com',
    'v6.douyinvod.com',
    'v9-y.douyinvod.com',
    'v26.douyinvod.com',
    'v11.douyinvod.com',
    'v5-dy-h.ixigua.com',
    'v5-dy-i.ixigua.com',
    'v3.douyinvod.com',
    'v6-z.douyinvod.com',
    'v5-g.douyinvod.com',
    'v5-gdgz.douyinvod.com',
    'v5-h.douyinvod.com',
    'v29.douyinvod.com',
    'v6-y.douyinvod.com',
    'v1.douyinvod.com',
    'v9.douyinvod.com',
    'v6-x.douyinvod.com',
    'v5-dy-f.ixigua.com']
  for (let i = 0; i < 10; i++) {
    let res = await superagent.get(originVideoUrl).set('User-Agent', userAgent)
    videoUrl = res.redirects[0].replace('http', 'https')
    let domain = new URL(videoUrl);
    if (validDomains.includes(domain.hostname)) {
      success = true
      break
    }
  }
  return {success, videoUrl};
}

function saveVideoInfo(openid, videoId, title, cover, videoUrl, statistics) {
  cloud.database().collection('links').add({
    data: {
      videoId,
      title,
      url: videoUrl,
      openid,
      statistics,
      cover,
      created_at: new Date()
    }
  })
    .then(res => {
      console.log('入库成功: ', res)
    }, rej => {
      console.log('入库出错: ', rej)
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (!event.url) {
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      error: '1000'
    }
  }

  let videoId = await getVideoId(event.url);
  let {originVideoUrl, title, statistics, cover} = await getVideoDetail(videoId);
  let {success, videoUrl} = await getValidVideoUrl(originVideoUrl);

  if (!success) {
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      error: '1001'
    }
  }

  saveVideoInfo(wxContext.OPENID, videoId, title, cover, videoUrl, statistics);

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    videoUrl,
    title,
    error: '0'
  }
}
