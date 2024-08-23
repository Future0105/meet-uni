import request from '@/utils/request.js'
//推荐 随机图
export function request_getTuiJianList() {
  return request({
    url: "/randomWall"
  })
}

//birthday	string	必填	年龄格式：2000-01-01
//根据传入的年龄计算你的生肖、星座 
export function getConstellation_API(data = {}) {
  return request({
    url: "/",
    data
  })
}