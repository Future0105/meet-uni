import { defineStore } from "pinia"
import { ref } from "vue"
import { login_API } from '@/api/data'
export const userLoginStore = defineStore("login", () => {

  const loginData = ref({})
  const login = async ({ username, password }) => {
    //-------测试---------
    // let res = await getConstellation_API({
    //   birthday: '2002-01-05'
    // })

    // const res = await login_API({ username, password })
    // if (res.code === 200) 
    if (username === 'system' && password === 'admin123') {
      // loginData.value = res.data
      loginData.value = {
        loginInfo: {
          loginTeamValue: 2,  //teamId
          loginTeamName: '三大队',
          loginTeacherId: 2, //公用账号要为空
          loginTeacherName: '张三'
        },
        teamList: [
          { value: 0, text: '一大队' },  //text  大队名称
          { value: 1, text: '二大队' },
          { value: 2, text: '三大队' },
          { value: 3, text: '四大队' },
          { value: 100, text: '五大队' }
        ]
      }
      uni.navigateTo({
        url: '/pages/index/index'
      })
    } else {
      uni.showToast({
        title: '登录失败,账号或密码错误',
        icon: 'none'
      })
    }
  }

  return {
    login,
    loginData
  }
},
  // TODO: 持久化
  {
    // 网页端的配置
    // persist: true,
    // 小程序端的配置
    persist: {
      storage: {
        // h5: localStorage.getItem(key)
        // mp: wx.getStorageSync(key),
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value)
        // 内部处理了序列化和反序列化
      },
    },
  })