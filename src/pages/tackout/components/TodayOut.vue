<template>
  <view class="todayOut">
    <view class="header">
      <view class="team-select">
        <uni-data-select
          label="所在大队"
          placeholder="请选择组织"
          emptyTips="暂无数据"
          v-model="loginTeamValue"
          :clear="false"
          :localdata="teamList"
          @change="teamChange"
        ></uni-data-select>
      </view>
      <view class="header-title">
        <text>今日已带出 {{ outNumber }} 个学员</text>
      </view>
    </view>
    <view class="main">
      <view class="student-list">
        <uni-table ref="studentTable" border stripe emptyText="暂无更多数据">
          <uni-tr height="50">
            <uni-th width="60" align="center">学员姓名</uni-th>
            <uni-th width="130" align="center">申请会见家属</uni-th>
            <uni-th width="100" align="center">学员所在大队</uni-th>
            <uni-th width="100" align="center">学员家庭住址</uni-th>
            <uni-th width="100" align="center">状态</uni-th>
            <uni-th width="100" align="center">备注</uni-th>
          </uni-tr>
          <uni-tr height="50" v-for="(item, index) in studentsList" :key="item.studentId">
            <uni-td align="center">{{ item.name }}</uni-td>
            <uni-td align="center">
              <text style="padding: 0 3.6621rpx" v-for="(family, index) in item.familyName" :key="index">
                {{ family }}
              </text>
            </uni-td>
            <uni-td align="center">{{ item.teamName }}</uni-td>
            <uni-td align="center">{{ item.address }}</uni-td>
            <uni-td align="center">{{ item.status }}</uni-td>
            <uni-td align="center">{{ item.info }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, onUnmounted } from 'vue'
import { userLoginStore } from '@/store/login.js'
//所有队伍列表
const teamList = [
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
]
//下拉框选中队伍(默认为当前登录大队)
const loginTeamValue = ref(0)

// 定义定时器变量
let timer = null
//带出学员列表
const studentsList = ref([])
const outNumber = ref(0)
// 定义获取数据的方法
const getData = () => {
  studentsList.value = [
    {
      studentId: 1001,
      name: '大毛',
      familyName: ['大毛父亲'],
      teamName: '三大队',
      address: '北京',
      status: '已带出',
      info: '无'
    },
    {
      id: 1002,
      name: '二毛',
      familyName: ['二毛父亲', '二毛母亲'],
      teamName: '三大队',
      address: '上海',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1003,
      name: '熊大',
      familyName: ['熊大父亲', '熊大母亲', '熊大儿子'],
      teamName: '三大队',
      address: '广州',
      status: '不带出',
      info: '不符合会见要求不符合会见要求'
    },
    {
      studentId: 1004,
      name: '熊二',
      familyName: ['熊二父亲', '熊二母亲', '熊二儿子', '熊二女儿'],
      teamName: '三大队',
      address: '深圳',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1005,
      name: '张三',
      familyName: ['父亲'],
      teamName: '三大队',
      address: '重庆',
      status: '不带出',
      info: '任务未完成'
    },
    {
      studentId: 1006,
      name: '李四',
      familyName: ['父亲', '母亲'],
      teamName: '三大队',
      address: '四川',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1007,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1008,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '不带出',
      info: '身体原因'
    },
    {
      studentId: 1009,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '不带出',
      info: '学员拒绝会见'
    },
    {
      studentId: 1010,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1011,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1012,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1013,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    }
  ]
  outNumber.vue = studentsList.value.length
  console.log('已带出定时器执行中')
}
onLoad(() => {
  const loginStore = userLoginStore()
  // 当前登录队伍value默认选中
  // loginTeamValue.value = loginStore.loginData.loginInfo.loginTeamValue
  // 首次请求数据
  getData()
  // 设置定时器，每隔5秒请求一次数据
  timer = setInterval(getData, 3000)
})

//改变队伍
const teamChange = e => {
  // e === teamList.value
  // 先查找与 e 匹配的项
  teamName.value = teamList.value.find(item => item.value === e)
  // 处理找到的情况
  if (teamName.value) {
    // 如果找到了匹配的项,发起请求,获取选择队伍数据
    // teamName.value = foundItem.text
    // await getTeamData_API(teamName.value)
  }
  // teamName.value = teamList.value.find(item => item.value === e)?.text
  // await getTeamData_API(teamName.value)
}

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('今日已带出,定时器已清除')
  }
})
</script>

<style lang="scss" scoped>
.todayOut {
  height: 100%;
  // position: relative;
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 12%;
    margin: 0 3%;
    padding: 0 2%;
    background-color: rgba(175, 174, 174, 0.3);
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    // overflow: hidden;
    .team-select {
      width: 35%;
      // height: 200px;
      padding: 0 0 0 3.6621rpx /* 5px -> 3.6621rpx */;
      background-color: #fff;
      border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      // overflow-y: auto;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .header-title {
      flex: 5;
      max-height: 100%;
      margin-left: 21.9727rpx /* 30px -> 21.9727rpx */;
      font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
      color: rgb(74, 76, 77);
    }
  }
  .main {
    max-height: 88%;
    padding: 10.9863rpx /* 15px -> 10.9863rpx */ 3%;
    display: flex;
    flex-direction: column;
    .student-list {
      height: 100%;
      border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow-y: auto; /* 添加垂直滚动条 */
    }
  }
}
</style>
