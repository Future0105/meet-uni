<template>
  <view class="container">
    <view class="layout">
      <view class="title">
        <button class="homeBtn" @click="redirectTo(`/pages/index/index`)">
          <uni-icons type="home" size="50"></uni-icons>
        </button>
        <text>探 访 记 录</text>
      </view>
      <view class="studentInfo">
        <view class="header">
          <view class="search-info">
            <view class="student-name inp">
              <text>姓名：</text>
              <uni-easyinput v-model="searchName" placeholder="请输入学员姓名"></uni-easyinput>
            </view>
            <view class="time-start inp">
              <text>起始时间：</text>
              <uni-datetime-picker type="date" :clear-icon="true" v-model="searchStartTime" @change="changeStartTime" />
            </view>
            <view class="student-address inp">
              <text>住址：</text>
              <uni-easyinput v-model="searchAddress" placeholder="请输入家庭住址"></uni-easyinput>
            </view>
            <view class="time-end inp">
              <text>截止时间：</text>
              <uni-datetime-picker type="date" :clear-icon="true" v-model="searchEndTime" @change="changeEndTime" />
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
          <view class="search-btn">
            <button @click="searchBtn">查询</button>
          </view>
        </view>
        <view class="main">
          <view class="student-list">
            <uni-table ref="studentTable" border stripe emptyText="暂无更多数据">
              <uni-tr height="70">
                <uni-th width="60" align="center">学员姓名</uni-th>
                <uni-th width="160" align="center">学员身份证号</uni-th>
                <uni-th width="40" align="center">学员状态</uni-th>
                <uni-th width="80" align="center">所在大队</uni-th>
                <uni-th width="80" align="center">探访家属</uni-th>
                <uni-th width="70" align="center">申请时间</uni-th>
                <uni-th width="70" align="center">探访时间</uni-th>
                <uni-th width="40" align="center">探访窗口</uni-th>
                <uni-th width="70" align="center">操作</uni-th>
              </uni-tr>
              <uni-tr height="70" v-for="(item, index) in studentsList" :key="item.studentId">
                <uni-td align="center">{{ item.name }}</uni-td>
                <uni-td align="center">{{ item.num }}</uni-td>
                <uni-td align="center">{{ item.teamName }}</uni-td>
                <uni-td align="center">{{ item.address }}</uni-td>
                <uni-td align="center">{{ item.status }}</uni-td>
                <uni-td align="center">{{ item.info }}</uni-td>
                <uni-td align="center">{{ item.z }}</uni-td>
                <uni-td align="center">{{ item.zaidui }}</uni-td>
                <uni-td>
                  <view class="video-btn">
                    <button @click="getVideo" class="video" size="mini">录像回放</button>
                  </view>
                </uni-td>
              </uni-tr>
            </uni-table>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// import HeadFill from '../../components/HeadFill/HeadFill.vue'
import { userLoginStore } from '@/store/login.js'
import { redirectTo } from '@/utils/to.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { debounce, throttle } from 'lodash' //防抖与节流
import { ref } from 'vue'
//名字搜索
const searchName = ref('')
//地址搜索
const searchAddress = ref('')
//起始时间
const searchStartTime = ref('')
//截止时间
const searchEndTime = ref('')

const loginTeamValue = ref(0)

//所有队伍列表
const teamList = ref([
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
])
const teamName = ref(teamList.value[0].text)
const studentsList = [
  {
    studentId: 1001,
    name: '大阿达毛',
    num: '5',
    teamName: '男',
    address: '北京',
    status: '非洲非洲大队长大队长',
    info: '超级',
    z: '不听话',
    zaidui: '在队',
    in: '录像回放',
    out: '2023年03月01日',
    face: '人脸采集'
  },
  {
    id: 1002,
    name: '二毛',
    num: 500222200000000000000,
    teamName: '三大队',
    address: '上海',
    status: '已带出',
    info: '无',
    z: '不听话',
    zaidui: '在队',
    in: '2023年03月01日',
    in: '录像回放',
    face: '人脸采集'
  },
  {
    studentId: 1003,
    name: '熊大',
    num: ['12345678903412567'],
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
    num: ['熊二父亲', '熊二母亲', '熊二儿子', '熊二女儿'],
    teamName: '三大队',
    address: '深圳',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1005,
    name: '张三',
    num: ['父亲'],
    teamName: '三大队',
    address: '重庆',
    status: '不带出',
    info: '任务未完成'
  },
  {
    studentId: 1006,
    name: '李四',
    num: ['父亲', '母亲'],
    teamName: '三大队',
    address: '四川',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1007,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1008,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '不带出',
    info: '身体原因'
  },
  {
    studentId: 1009,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '不带出',
    info: '学员拒绝会见'
  },
  {
    studentId: 1010,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1009,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1010,
    name: '王五',
    num: ['父亲', '母亲', '大舅哥'],
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  },
  {
    studentId: 1009,
    name: '王五',
    num: '123123123',
    teamName: '三大队',
    address: '台湾',
    status: '已带出',
    info: '无'
  }
]
//改变队伍
const teamChange = e => {
  // e === teamList.value
  // 先查找与 e 匹配的项
  teamName.value = teamList.value.find(item => item.value === e).text
  // 处理找到的情况
  if (teamName.value) {
    // 如果找到了匹配的项,发起请求,获取选择队伍数据
    // teamName.value = foundItem.text
    // await getTeamData_API(teamName.value)
  }
  // teamName.value = teamList.value.find(item => item.value === e)?.text
  // await getTeamData_API(teamName.value)
}

const searchBtn = async () => {
  //  //根据条件  发起请求
  console.log('name:', searchName.value)
  console.log('address:', searchAddress.value)
  console.log('searchStartTime:', searchStartTime.value)
  console.log('searchEndTime:', searchEndTime.value)
  console.log('teamName:', teamName.value)
  uni.showToast({
    title: `查询
    名字:${searchName.value}
    地址:${searchAddress.value}
    起始时间:${searchStartTime.value}
    截止时间:${searchEndTime.value} 
    所属大队:${teamName.value}`,
    icon: 'none'
  })
  //let res =  await getTeamData_API({
  //   studentName: searchName.value,
  //   homeAddress: searchAddress.value,
  //   team: teamName.value
  // })
}

//录像回放
//leading延迟开始前调用  trailing延迟结束后调用
const getVideo = debounce(
  () => {
    if (uni.getSystemInfoSync().platform === 'android') {
      window.android.H5ToAndroid('FACE_COLLECT')
    }
    console.log('录像回放')
  },
  1000,
  { leading: true, trailing: false }
)

const changeStartTime = e => {
  searchStartTime.value = e
}
const changeEndTime = e => {
  searchEndTime.value = e
}
let timer = null
// 定义获取数据的方法
const getData = () => {
  studentsList.value = [
    {
      studentId: 1001,
      name: '大阿达毛',
      num: '5',
      teamName: '男',
      address: '北京',
      status: '非洲非洲大队长大队长',
      info: '超级',
      z: '不听话',
      zaidui: '在队',
      in: '录像回放',
      out: '2023年03月01日',
      face: '人脸采集'
    },
    {
      id: 1002,
      name: '二毛',
      num: 500222200000000000000,
      teamName: '三大队',
      address: '上海',
      status: '已带出',
      info: '无',
      z: '不听话',
      zaidui: '在队',
      in: '2023年03月01日',
      in: '录像回放',
      face: '人脸采集'
    },
    {
      studentId: 1003,
      name: '熊大',
      num: ['12345678903412567'],
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
      num: ['熊二父亲', '熊二母亲', '熊二儿子', '熊二女儿'],
      teamName: '三大队',
      address: '深圳',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1005,
      name: '张三',
      num: ['父亲'],
      teamName: '三大队',
      address: '重庆',
      status: '不带出',
      info: '任务未完成'
    },
    {
      studentId: 1006,
      name: '李四',
      num: ['父亲', '母亲'],
      teamName: '三大队',
      address: '四川',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1007,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1008,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '不带出',
      info: '身体原因'
    },
    {
      studentId: 1009,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '不带出',
      info: '学员拒绝会见'
    },
    {
      studentId: 1010,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1009,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1010,
      name: '王五',
      num: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    },
    {
      studentId: 1009,
      name: '王五',
      num: '123123123',
      teamName: '三大队',
      address: '台湾',
      status: '已带出',
      info: '无'
    }
  ]
  console.log('探访记录,定时器执行中')
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
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('探访记录,定时器已清除')
  }
}
// 页面卸载时触发 redirectTo卸载,navigateTo保留
onUnload(clearTimer)
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding-top: 10.9863rpx /* 15px -> 10.9863rpx */;
  .layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-image: url('@/static/image/slices/loginBgS.png');
    //contain按比例缩放,可能不会覆盖整个背景区域
    //cover按比例缩放以完全覆盖背景区域，可能会裁剪掉部分图像
    background-size: 100% 100%; /* 图像会拉伸以适应背景区域的大小 */
    background-position: center; /* 可选：将背景图像居中 */
    .title {
      position: relative;
      width: 100vw;
      height: 13%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 29.2969rpx /* 40px -> 29.2969rpx */;
      font-weight: 700;
      color: rgb(51, 89, 255);
      .homeBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        // overflow: hidden;
        position: absolute;
        left: 3%;
        width: 8%;
        height: 60%;
      }
    }
    .studentInfo {
      height: 86%;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 18%;
        margin: 0 3%;
        padding: 0 2%;
        background-color: rgba(175, 174, 174, 0.3);
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        .search-info {
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          // background-color: aqua;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          .inp {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 139.1602rpx /* 190px -> 139.1602rpx */;
            max-height: 46%;
            // overflow: hidden;
            &:nth-child(2n) {
              margin-left: 25.6348rpx /* 35px -> 25.6348rpx */;
              width: 168.457rpx /* 230px -> 168.457rpx */;
            }
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
        .search-btn {
          width: 73.2422rpx /* 100px -> 73.2422rpx */;
          border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
          overflow: hidden;
          button {
            color: #fff;
            font-weight: 600;
            font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
            background-color: #00aaff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .main {
        max-height: 82%;
        padding: 10.9863rpx /* 15px -> 10.9863rpx */ 3%;
        display: flex;
        flex-direction: column;
        .student-list {
          height: 100%;
          border: 1px #b8b5b5 solid;
          border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
          overflow-y: auto; /* 添加垂直滚动条 */
          .video-btn {
            // margin: 0;
            // padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: #00aaff;
            .video {
              margin: 0;
              padding: 0;
              padding: 4.3945rpx /* 6px -> 4.3945rpx */;
              background-color: #ececec;
            }
          }
        }
      }
    }
  }
}
</style>
