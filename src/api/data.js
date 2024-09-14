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
//推送更新待带出学员
export function upDataStudentsList_API() {
  return request({
    url: "/Pad_GetCboListPush",
  })
}
//获取部门列表
export function getTeamsList_API() {
  return request({
    url: "/Pad_GetCollegeList",
  })
}

//获取教员列表
export function getTeachersList_API(data = {}) {
  return request({
    url: "/Pad_GetPolicemanList",
    data //默认传参0-所有民警,参数-部门ID  CollegeId
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
    // RealName=李涛 & DepartPath=重庆市九& CollegeId=0 & SearchType=0 & PageShowNum=7 & PageNum=1
    data   //RealName  DepartPath CollegeId SearchType
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1

  })
}
//获取学员详细信息
export function getStudentAllInfo_API(data = {}) {
  return request({
    url: "/Pad_GetCadet",
    data   //UserId=4378
  })
}
//保存学员详细信息
export function pushStudentAllInfo_API(data = {}) {
  return request({
    url: "/Pad_UpdCadet",
    data   //UserId=4378 UserId：学员Id，FrozenDateTime：入所时间，RoundTime：解教时间，Sex：性别，CollegeId：所在大队Id，Visit_CadetStateId：学员状态Id，Visit_InTeamStateId：在队状态Id，Visit_AttentLevelId：关注等级Id，DepartPath：家庭住址
  })
}

//获取学员状态列表
export function getStudentStateList_API() {
  return request({
    url: "/Pad_Get",
  })
}
//获取在队状态列表
export function getTeamStateList_API() {
  return request({
    url: "/Pad_Get",
  })
}
//获取关注等级列表
export function getLevelStateList_API() {
  return request({
    url: "/Pad_Get",
  })
}

//教员信息列表
export function getTeachersInfo_API(data = {}) {
  return request({
    url: "/Pad_GetPolicemanInfoList",
    data  // RealName=李涛 & PersonNo=100016110& CollegeId=0& SearchType=0
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
  })
}
//获取教员详细信息
export function getTeacherAllInfo_API(data = {}) {
  return request({
    url: "/Pad_GetPoliceman",
    data   //UserId=4350
  })
}
//保存教员详细信息
export function pushTeacherAllInfo_API(data = {}) {
  return request({
    url: "/Pad_UpdPoliceman",
    data   //UserId=4350&Remark=重名标识&Phone=13619856495&Sex=男&CollegeId=331
  })
}

//获取探访记录列表
export function getRecordList_API(data = {}) {
  return request({
    url: "/Pad_GetVisitRecordList",
    data //CollegeId=1&CadetId=177&Year=2024&Month=12&PageShowNum=7&PageNum=1
  })
}

