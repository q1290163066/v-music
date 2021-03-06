import request from './request'

//获取url中参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function wechatAuthPlugin(){
    const params = {
        url: location.href.split('#')[0]
    }

    request.get('/signature', params, '').then((res)=>{
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appid, // 必填，公众号的唯一标识
            //timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature,// 必填，签名
            jsApiList: [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表
        })
    })
}

