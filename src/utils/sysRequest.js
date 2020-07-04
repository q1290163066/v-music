'use strict'

import { detectData } from './detect-error'
import { MessageBox } from 'mint-ui' // MessageBox,
import axios from 'axios'

//alert(this.$route.query)
// import qs from 'qs'
axios.defaults.timeout = 30000
axios.defaults.baseURL = '/agent' // 设置请求api的URL
// axios.defaults.baseURL = 'http://wealth.phscitech.com/api' // 设置请求api的URL

// 拦截请求返回数据，将14位及以上的数字number转成string类型
axios.defaults.transformResponse = [ (data) => {
  if (typeof data === 'string') {
      try {
          let d = data
          let array = d.match(/:\d{14}\d*/g)
          if (array === null) {
              data = JSON.parse(data)
              return data
          }
          for (let i = 0; i < array.length; i++) {
              let str = array[i]
  
              let number = str.replace(':', '')
              d = d.replace(str, ':"' + number + '"')
          }
          data = JSON.parse(d)
      } catch (e) { /* Ignore */
      }
  }
  return data
}]

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.status >= 200 && response.status < 300) {
    console.log('client', response.status)
    return response
  }
  console.log('res 错误状态')
  console.log(response)
  return Promise.reject(response)
}, error => {
  console.log('error')
  console.log(error)
  // Message({
  //   message: error || 'Error',
  //   type: 'error',
  //   duration: 5 * 1000
  // })
  return Promise.resolve(error.response)
})





function checkStatus (response) {
  // loading
  console.log('response')
  console.log(response)
  
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常,请稍后再试！'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    MessageBox({
        message: res.msg || 'Error',
        type: 'error',
        confirmButtonClass: 'error-401'
        //duration: 5 * 1000
    })
  }
  
  console.log('res.data')
  console.log(res.data)
  if (res.data && res.data.code == 401) {
    MessageBox({
          $type:'confirm',
          title:'友情提示',
          message:'您的账号已过期，请重新登录',
          showCancelButton:false,   //不显示取消按钮
          confirmButtonClass: 'error-401'
      }).then( (action) => {
          /* value 为填写的值，进行下一步操作*/
          console.log( action )
          if( action == 'confirm' ){
              window.localStorage.removeItem('login_data')
              window.location.href='/agent/login'
          }
      }).catch((err)=>{
        console.log(err)
      });
  }

  //   console.log('error 测试')
  //   console.log(res)
  //   //console.log(res.data.error_msg)
  // }
  return res
}

export default {
  post (url, dataParams, pushData, headParams) {

    let headerOption = {
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      'Content-Type': 'application/json'
      //'Content-Type': 'multipart/form-data'
    }

    if(headParams !== '' && headParams !== null && headParams !== undefined){
      headParams = Object.assign(headerOption, headParams)
    } 
    console.log(headParams)
    console.log(pushData)
    return axios({
      method: 'post',
      url,
      params: dataParams,
      data: JSON.stringify(pushData),
      headers: headerOption
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  delete (url, dataParams, pushData, headParams) {

    let headerOption = {
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      'Content-Type': 'application/json'
      //'Content-Type': 'multipart/form-data'
    }

    if(headParams !== '' && headParams !== null && headParams !== undefined){
      headParams = Object.assign(headerOption, headParams)
    } 
    console.log(headParams)
    console.log(pushData)
    return axios({
      method: 'delete',
      url,
      params: dataParams,
      data: JSON.stringify(pushData),
      headers: headerOption
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params, headParams) {
    //
    let options = {}
    let headerOption = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type':	'application/json',
    }

   if(headParams !== '' && headParams !== null && headParams !== undefined){
      //head参数
      const newHeaderOption = Object.assign(headerOption, headParams)
      console.log(headParams)
      console.log(newHeaderOption)

      if(params == null || params == undefined){
          options = {
            method: 'get',
            url: url,
            headers: newHeaderOption
          }
      } else {
          options = {
            method: 'get',
            url: url,
            params: params,
            headers: newHeaderOption
          }
      }
  }else{
      if(params == null || params == undefined){
        options = {
          method: 'get',
          url: url,
          headers: headerOption
        }
      } else {
          options = {
            method: 'get',
            url: url,
            params: params,
            headers: headerOption
          }
      }
  }

    //请求返回数据
    return axios(options).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )

    //end
    
  }
}