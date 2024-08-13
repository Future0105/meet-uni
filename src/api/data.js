import request from '@/utils/request.js'

//birthday	string	必填	年龄格式：2000-01-01
//根据传入的年龄计算你的生肖、星座 
export function getConstellation_API(data = {}) {
  return request({
    url: "/",
    data
  })
}
//--------------------------------------------------
//获取不带出理由列表
export function getReasons_API() {
  return request({
    url: "/",  //接口地址
  })
}






export function login_API(data = {}) {
  return request({
    url: "/userLogin",
    data   //账号 密码
  })
}

//获取大队列表
export function getTeamData_API(data = {}) {
  return request({
    url: "/teamname",
    data  //队伍名字
  })
}

//获取大队列表
export function pushTodayList_API(data = {}) {
  return request({
    url: "/teamname",
    data  //队伍名字
  })
}