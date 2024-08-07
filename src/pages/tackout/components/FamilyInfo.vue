<template>
  <view class="header">
    <view class="search-info">
      <view class="student-name inp">
        <text>学员姓名：</text>
        <uni-easyinput v-model="serchName" placeholder="请输入内容"></uni-easyinput>
      </view>
      <view class="student-address inp">
        <text>家庭住址：</text>
        <uni-easyinput v-model="serchAddress" placeholder="请输入内容"></uni-easyinput>
      </view>
    </view>
    <view class="team-select">
      <uni-data-select
        label="所在大队"
        placeholder="请选择组织"
        emptyTips="暂无数据"
        v-model="loginTeamValue"
        :clear="false"
        :localdata="teamList"
      ></uni-data-select>
    </view>
    <view class="data-show">
      <uni-data-checkbox v-model="dataChange" :localdata="dataShow"></uni-data-checkbox>
    </view>
    <view class="search-btn">
      <button>查询</button>
    </view>
  </view>
  <view class="main">
    <view class="student-list">
      <uni-table ref="studentTable" border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="65" align="center">姓名</uni-th>
          <uni-th width="165" align="center">身份证号</uni-th>
          <uni-th width="50" align="center">性别</uni-th>
          <uni-th width="100" align="center">家庭住址</uni-th>
          <uni-th width="100" align="center">所在大队</uni-th>
          <uni-th width="50" align="center">关注等级</uni-th>
          <uni-th width="50" align="center">学员状态</uni-th>
          <uni-th width="50" align="center">在队状态</uni-th>
          <uni-th width="90" align="center">入所时间</uni-th>
          <uni-th width="90" align="center">解教时间</uni-th>
          <uni-th width="80" align="center">操作</uni-th>
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
          <uni-td align="center">{{ item.z }}</uni-td>
          <uni-td align="center">{{ item.zaidui }}</uni-td>
          <uni-td align="center">{{ item.in }}</uni-td>
          <uni-td align="center">{{ item.out }}</uni-td>
          <uni-td align="center">{{ item.face }}</uni-td>
        </uni-tr>
      </uni-table>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const dataChange = ref(0)
const dataShow = ref([
  {
    text: '全部数据',
    value: 0
  },
  {
    text: '仅显示未录入人脸数据',
    value: 1
  }
])
console.log(dataChange.value)
const serchName = ref('')
console.log(serchName.value)
const serchAddress = ref('')
//所有队伍列表
const teamList = [
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
]
const studentsList = [
  {
    studentId: 1001,
    name: '大阿达毛',
    familyName: ['阿萨德是的是的是的是的是的是的是的'],
    teamName: '男',
    address: '北京',
    status: '非洲非洲大队长大队长',
    info: '超级',
    z: '不听话',
    zaidui: '在队',
    in: '2023-03-01',
    out: '2023年03月01日',
    face: '人脸采集'
  },
  {
    id: 1002,
    name: '二毛',
    familyName: ['阿萨德是的是的是的是的是的是的是的', '二毛母亲'],
    teamName: '三大队',
    address: '上海',
    status: '已带出',
    info: '无',
    z: '不听话',
    zaidui: '在队',
    in: '2023年03月01日',
    out: '2023年03月01日',
    face: '人脸采集'
  },
  {
    studentId: 1003,
    name: '熊大',
    familyName: ['12345678903412567'],
    teamName: '三大队',
    address: '广州',
    status: '不带出',
    info: '不符合会见要求不符合会见要求',
    z: '不听话',
    zaidui: '在队',
    in: '2023-03-01',
    out: '2023年03月01日',
    face: '操作'
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
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12%;
  margin: 0 3%;
  padding: 2%;
  background-color: rgba(175, 174, 174, 0.3);
  border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
  .search-info {
    display: flex;
    // background-color: aqua;
    font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
    .inp {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 124.5117rpx /* 170px -> 124.5117rpx */;
      margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
    }
  }
  .team-select {
    // flex: 1;
    width: 219.7266rpx /* 300px -> 219.7266rpx */;
    margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
    padding: 0 0 0 3.6621rpx /* 5px -> 3.6621rpx */;
    background-color: #ffffff;
    border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
    white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
  }
  .data-show {
    display: flex;
    flex-direction: column;
    width: 139.1602rpx /* 190px -> 139.1602rpx */;
    // background-color: rgb(216, 141, 27);
  }
  .search-btn {
    width: 58.5938rpx /* 80px -> 58.5938rpx */;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    overflow: hidden;
    button {
      color: #fff;
      font-weight: 600;
      background-color: #00aaff;
    }
  }
}
.main {
  max-height: 88%;
  padding: 14.6484rpx /* 20px -> 14.6484rpx */;
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
