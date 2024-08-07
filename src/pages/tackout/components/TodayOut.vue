<template>
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
        <uni-tr>
          <uni-th width="60" align="center">学员姓名</uni-th>
          <uni-th width="130" align="center">申请会见家属</uni-th>
          <uni-th width="100" align="center">学员所在大队</uni-th>
          <uni-th width="100" align="center">学员家庭住址</uni-th>
          <uni-th width="100" align="center">状态</uni-th>
          <uni-th width="100" align="center">备注</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in studentsList" :key="item.studentId">
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
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { userLoginStore } from '@/store/login.js'
//所有队伍列表
const teamList = [
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
]
//带出学员列表
const studentsList = [
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
    studentId: 1009,
    name: '王五',
    familyName: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
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
    studentId: 1009,
    name: '王五',
    familyName: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  }
]
const outNumber = ref(0)
onLoad(() => {
  const loginStore = userLoginStore()
  // 当前登录队伍value默认选中
  loginTeamValue.value = loginStore.loginData.loginInfo.loginTeamValue
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12%;
  margin: 0 3%;
  padding: 2%;
  background-color: rgba(175, 174, 174, 0.3);
  border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
  .team-select {
    width: 35%;
    padding: 0 0 0 3.6621rpx /* 5px -> 3.6621rpx */;
    background-color: #fff;
    border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
    white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-title {
    flex: 5;
    margin-left: 21.9727rpx /* 30px -> 21.9727rpx */;
    font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
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
    border: 1px #b8b5b5 solid;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    overflow-y: auto; /* 添加垂直滚动条 */
  }
}
</style>
