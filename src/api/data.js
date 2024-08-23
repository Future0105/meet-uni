import request from '@/utils/request.js'
//登录
export function login_API(data = {}) {
  return request({
    url: "/Pad_Login",
    data   //账号UserName 密码Password
  })
}
//获取待带出学员
export function getStudentsList_API(data = {}) {
  return request({
    url: "/Pad_GetCboList",
    data   //不传参-所有学员,可选参数-部门ID  CollegeId
  })
}

//获取部门列表
export function getTeamsList_API() {
  return request({
    url: "/Pad_GetCollegeList",
  })
}

//获取教员列表
export function getTeachersList_API() {
  return request({
    url: "/Pad_GetPolicemanList",
  })
}
//获取不带出理由列表
export function getReasonsList_API() {
  return request({
    url: "/Pad_GetNborList",
  })
}

//暂不带出该学员
export function pushWaitOut_API(data = {}) {
  return request({
    url: "/Pad_TempoNoBringOut",
    data   //Id
  })
}

//不带出该学员
export function pushNotOut_API(data = {}) {
  return request({
    url: "/Pad_NoBringOut",
    data   //Id   NoBringOutReasonId
  })
}
//带出勾选学员
export function pushTackOut_API(data = {}) {
  return request({
    url: "/Pad_BringOut",
    data   //Ids  PolicemanIds
  })
}

// 今日已带出学员列表
export function getTodayOutList_API(data = {}) {
  return request({
    url: "/Pad_GetTodayCboList",
    data   //CollegeId
  })
}

//学员信息列表
export function getStudentsInfo_API(data = {}) {
  return request({
    url: "/Pad_GetCadetList",
    data   //RealName  DepartPath CollegeId SearchType
  })
}

//教员信息列表
export function getTeachersInfo_API(data = {}) {
  return request({
    url: "Pad_GetPolicemanInfoList",
    data   //RealName PersonNo CollegeId SearchType
  })
}
