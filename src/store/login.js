import { defineStore } from "pinia"
import { ref } from "vue"
import { redirectTo } from '@/utils/to.js'
import { login_API, getTeamsList_API } from '@/api/data' //getTeachersList_API
export const userLoginStore = defineStore("login", () => {
  const loginInfo = ref({}) //登录信息 {Id: 177, RealName: '未知', CollegeId: 2, CollegeName: '重庆市女子监狱'}
  const teamsList = ref([]) //部门列表
  //登录
  const login = async ({ UserName, Password }) => {
    const loginInfoRes = await login_API({ UserName, Password })
    if (loginInfoRes.code === 200) {
      loginInfo.value = loginInfoRes.data
      redirectTo('/pages/tackout/tackout')
    } else if (loginInfoRes.code === 400) {
      uni.showToast({
        title: loginInfoRes.message,
        icon: 'none'
      })
    } else {
      uni.showToast({
        title: '未连接到服务器',
        icon: 'none'
      })
    }
  }
  const logout = () => {
    loginInfo.value = {}
    teamsList.value = []
    // teachersList.value = []
    redirectTo('/pages/login/login')
  }
  //获取部门列表
  const getTeamsList = async () => {
    const teamsListRes = await getTeamsList_API()
    if (teamsListRes.code === 200) {
      //map更换为下拉组件的数据字段
      teamsList.value = teamsListRes.data.map(team => ({
        value: team.Id,
        text: team.Name
      }))
    } else {
      uni.showToast({
        title: '获取部门信息失败',
        icon: 'none'
      })
    }
    // console.log(teamsList.value);
  }
  // //获取教员列表
  // const getTeachersList = async () => {
  //   const teachersListRes = await getTeachersList_API()
  //   if (teachersListRes.code === 200) {
  //     teachersList.value = teachersListRes.data
  //   } else {
  //     uni.showToast({
  //       title: '获取教员信息失败',
  //       icon: 'none'
  //     })
  //   }
  //   // console.log(teachersList.value);
  // }
  return {
    loginInfo,
    teamsList,
    // teachersList,
    login,
    logout,
    getTeamsList,
    // getTeachersList
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