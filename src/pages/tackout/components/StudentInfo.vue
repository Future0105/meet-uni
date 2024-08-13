<template>
  <view class="studentInfo">
    <view class="header">
      <view class="search-info">
        <view class="student-name inp">
          <text>学员姓名：</text>
          <uni-easyinput v-model="searchName" placeholder="请输入姓名"></uni-easyinput>
        </view>
        <view class="student-address inp">
          <text>家庭住址：</text>
          <uni-easyinput v-model="searchAddress" placeholder="请输入地址"></uni-easyinput>
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
          @change="teamChange"
        ></uni-data-select>
      </view>
      <view class="data-show">
        <uni-data-checkbox
          style="overflow: auto"
          @change="showDataChange"
          v-model="show"
          :localdata="showData"
        ></uni-data-checkbox>
      </view>
      <view class="search-btn">
        <button @click="searchBtn">查询</button>
      </view>
    </view>
    <view class="main">
      <view class="student-list">
        <uni-table ref="studentTable" border stripe emptyText="暂无更多数据">
          <uni-tr height="70">
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
          <uni-tr height="70" v-for="(item, index) in studentsList" :key="item.studentId">
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
            <uni-td>
              <view class="face-btn">
                <button @click="getFace" class="face" size="mini">人脸采集</button>
              </view>
            </uni-td>
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
import { debounce, throttle } from 'lodash' //防抖与节流
onLoad(() => {})
//展示数据(0默认全部数据)
const showData = ref([
  {
    text: '全部数据',
    value: 0
  },
  {
    text: '仅显示未录入人脸数据',
    value: 1
  }
])
const show = ref(showData.value[0].value)
//名字搜索
const searchName = ref('')
//地址搜索
const searchAddress = ref('')
const loginTeamValue = ref(0)
const teamName = ref('')
//所有队伍列表
const teamList = ref([
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
])
const studentsList = ref([])

// 定义定时器变量
let timer = null

// 定义获取数据的方法
const getData = () => {
  studentsList.value = [
    {
      studentId: 1001,
      name: '大阿达毛',
      familyName: ['500000000000000'],
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
      familyName: ['500000000000000'],
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
      familyName: ['500000000000000'],
      teamName: '三大队',
      address: '广州',
      status: '不带出',
      info: '不符合',
      z: '不听话',
      zaidui: '在队',
      in: '2023-03-01',
      out: '2023年03月01日',
      face: '操作'
    },
    {
      studentId: 1004,
      name: '熊二',
      familyName: ['500000000000000'],
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
  console.log('学员信息获取,定时器执行中')
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
//改变展示数据条件
const showDataChange = e => {
  show.value = e.detail.value
  //根据条件  发起请求
  uni.showToast({
    title: '切换数据',
    icon: 'none'
  })
}

const searchBtn = async () => {
  //  //根据条件  发起请求
  console.log('name:', searchName.value)
  console.log('address:', searchAddress.value)
  console.log('teamName:', teamName.value)
  uni.showToast({
    title: `查询 名字:${searchName.value} 地址:${searchAddress.value} 所属大队:${teamName.value}`,
    icon: 'none'
  })
  //let res =  await getTeamData_API({
  //   studentName: searchName.value,
  //   homeAddress: searchAddress.value,
  //   team: teamName.value
  // })
}
//人脸采集
//leading延迟开始前调用  trailing延迟结束后调用
const getFace = debounce(
  () => {
    if (uni.getSystemInfoSync().platform === 'android') {
      window.android.H5ToAndroid('FACE_COLLECT')
    }
    console.log('人脸采集')
  },
  1000,
  { leading: true, trailing: false }
)
// 在组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('学员信息,定时器已清除')
  }
})
</script>

<style lang="scss" scoped>
.studentInfo {
  position: relative;
  height: 100%;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 12%;
    margin: 0 3%;
    padding: 0 2%;
    background-color: rgba(175, 174, 174, 0.3);
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    // overflow: hidden;
    .search-info {
      display: flex;
      // background-color: aqua;
      font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
      max-height: 100%;
      .inp {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 124.5117rpx /* 170px -> 124.5117rpx */;
        max-height: 100%;
        margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
      }
    }
    .team-select {
      // flex: 1;
      width: 219.7266rpx /* 300px -> 219.7266rpx */;
      max-height: 100%;
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
      align-items: center;
      justify-content: center;
      // height: 100%;
      width: 139.1602rpx /* 190px -> 139.1602rpx */;
      max-height: 100%;
      // background-color: rgb(216, 141, 27);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-btn {
      width: 58.5938rpx /* 80px -> 58.5938rpx */;
      max-height: 100%;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow: hidden;
      button {
        color: #fff;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        font-weight: 600;
        background-color: #00aaff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
      .face-btn {
        // margin: 0;
        // padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: #00aaff;
        .face {
          margin: 0;
          padding: 0;
          padding: 4.3945rpx /* 6px -> 4.3945rpx */;
          background-color: #ececec;
        }
      }
    }
  }
}
</style>
