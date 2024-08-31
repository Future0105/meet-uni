<template>
  <view class="container">
    <view class="layout">
      <view class="title">
        <button class="homeBtn" @click="redirectTo(`/pages/index/index`)">
          <uni-icons type="home" size="40"></uni-icons>
          <text>主页</text>
        </button>
        <text>探 访 记 录</text>
      </view>
      <view class="studentInfo">
        <view class="header">
          <view class="search-info">
            <view class="searchInp">
              <view class="student-name inp">
                <text>姓名：</text>
                <uni-easyinput v-model="searchName" placeholder="请输入学员姓名"></uni-easyinput>
              </view>
              <view class="time-start date">
                <text>起始时间：</text>
                <uni-datetime-picker
                  type="date"
                  :clear-icon="true"
                  v-model="searchStartTime"
                  @change="changeStartTime"
                />
              </view>
            </view>
            <view class="searchDate">
              <view class="student-address inp">
                <text>住址：</text>
                <uni-easyinput v-model="searchAddress" placeholder="请输入家庭住址"></uni-easyinput>
              </view>
              <view class="time-end date">
                <text>截止时间：</text>
                <uni-datetime-picker type="date" :clear-icon="true" v-model="searchEndTime" @change="changeEndTime" />
              </view>
            </view>
          </view>
          <view class="team-box">
            <view class="team-select">
              <uni-data-select
                label="所在大队"
                placeholder="所有部门"
                :clear="true"
                emptyTips="暂无数据"
                v-model="selectTeam"
                :localdata="teamsList"
                @change="teamListChange"
              ></uni-data-select>
            </view>
            <button class="updata-btn search" @click="updata">
              <uni-icons type="search" color="#fff" size="35"></uni-icons><text>搜索</text>
            </button>
            <button class="updata-btn reload" @click="updata">
              <uni-icons type="reload" color="#fff" size="35"></uni-icons><text>刷新</text>
            </button>
          </view>
        </view>
        <view class="main">
          <view class="student-list">
            <uni-table ref="studentTable" border stripe emptyText="暂无更多数据">
              <uni-tr>
                <uni-th width="130" align="center">学员姓名</uni-th>
                <uni-th width="280" align="center">学员身份证号</uni-th>
                <uni-th width="80" align="center">学员状态</uni-th>
                <uni-th width="120" align="center">所在大队</uni-th>
                <uni-th width="160" align="center">探访家属</uni-th>
                <uni-th width="150" align="center">申请时间</uni-th>
                <uni-th width="150" align="center">探访时间</uni-th>
                <uni-th width="120" align="center">探访窗口</uni-th>
                <uni-th width="80" align="center">操作</uni-th>
              </uni-tr>
              <uni-tr v-for="(item, index) in studentsList" :key="item.studentId">
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

//所有队伍列表
const teamsList = ref([
  { value: 0, text: '一大队' }, //text  大队名称
  { value: 1, text: '二大队' },
  { value: 2, text: '三大队' },
  { value: 3, text: '四大队' },
  { value: 100, text: '五大队' }
])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(null)
const studentsList = [
  {
    studentId: 1001,
    name: '大阿达毛',
    num: '5000000002020210000',
    teamName: '在队在队',
    address: '北京啊啊大大我打',
    status: '阿萨德啊实打实阿阿萨德',
    info: '2000-00-00 00:00:00',
    z: '3000-00-00 00:00:00',
    zaidui: '一号窗口',
    in: '录像回放',
    out: '2023年03月01日',
    face: '人脸采集'
  },
  {
    studentId: 1001,
    name: '大阿达毛',
    num: '5000000002020210000',
    teamName: '在队在队',
    address: '北京啊啊大大我打',
    status: '阿萨德啊实打实阿阿萨德',
    info: '2000-00-00 00:00:00',
    z: '3000-00-00 00:00:00',
    zaidui: '一号窗口',
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

//下拉框更改部门查询学员
const teamListChange = async e => {
  selectTeam.value = e // e 为选中的部门id
}

const updata = async () => {
  // console.log('SearchType:', show.value)
  studentsList.value = [
    {
      RealName: '张三啊',
      IDCardNo: 435222200001016000,
      Sex: '男',
      DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东',
      CollegeName: '北碚区教育矫治所',
      AttentLevelName: '一级',
      CadetStateName: '生病',
      InTeamStateName: '李涛监狱',
      FrozenDateTime: '2000-00-00 00:00:00',
      RoundTime: '3000-00-00 00:00:00',
      IsFace: 1
    },
    {
      RealName: '张四',
      IDCardNo: 4351,
      Sex: '女',
      DepartPath: '重庆市北碚大区北碚大镇北碚大街道00号00号',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张五',
      IDCardNo: 4352,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张三',
      IDCardNo: 4350,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张四',
      IDCardNo: 4351,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张五',
      IDCardNo: 4352,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张三',
      IDCardNo: 4350,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张四',
      IDCardNo: 4351,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    },
    {
      RealName: '张五',
      IDCardNo: 4352,
      Sex: '男',
      DepartPath: '13618206431',
      CollegeName: '李涛',
      AttentLevelName: '一级',
      CadetStateName: '男',
      InTeamStateName: '李涛',
      FrozenDateTime: '李涛重名标识',
      RoundTime: '男',
      IsFace: 1
    }
  ]
  // pageCurrent.value = 1
  // await getStudentsInfo({
  //   RealName: searchName.value,
  //   DepartPath: searchAddress.value,
  //   CollegeId: selectTeam.value,
  //   SearchType: show.value,
  //   // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
  //   PageShowNum: pageSize,
  //   PageNum: pageCurrent.value
  // })
  // console.log(
  //   'RealName: ',
  //   searchName.value,
  //   'DepartPath: ',
  //   searchAddress.value,
  //   'CollegeId:',
  //   selectTeam.value,
  //   'SearchType:',
  //   show.value,
  //   // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
  //   'PageShowNum:',
  //   pageSize,
  //   'PageNum:',
  //   pageCurrent.value
  // )
  // studentsList.value = [
  //   {
  //     AttentLevelName: '一级一级',
  //     CadetStateName: '正常一级',
  //     CollegeName: '一大一大队队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 5002444200010101000,
  //     InTeamStateName: '在所',
  //     RealName: '王二大山',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男',
  //     IsFace: 1
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4352,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男',
  //     IsFace: 0
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4353,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男',
  //     IsFace: 0
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4354,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4355,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4356,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4357,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4358,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4359,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4360,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4361,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4362,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '一级',
  //     CadetStateName: '正常',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市九龙坡区华岩镇西站村9社203号',
  //     FrozenDateTime: '2020-01-10 00:00:00',
  //     Id: 4363,
  //     InTeamStateName: '在所',
  //     RealName: '王二',
  //     RoundTime: '2024-08-31 00:00:00',
  //     Sex: '男'
  //   },
  //   {
  //     AttentLevelName: '二级',
  //     CadetStateName: '生病',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市巴南区南泉镇3社47号',
  //     FrozenDateTime: '2023-06-15 00:00:00',
  //     Id: 4364,
  //     InTeamStateName: '刑事拘留',
  //     RealName: '张三',
  //     RoundTime: '2024-08-15 00:00:00',
  //     Sex: '男'
  //   }
  // ]
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
      teamName: '非洲非洲大队长大队长',
      address: '非洲非洲大队长大队长',
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
onLoad(async () => {
  const loginStore = userLoginStore()
  // 部门列表
  teamsList.value = loginStore.teamsList
  //根据登录信息,匹配默认选中部门
  if (teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId)) {
    selectTeam.value = teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId).value
  }
  //默认登录部门下的学员信息
  // await getStudentsList({ CollegeId: selectTeam.value })
  // loginStore.getTeamsList()
  // // 当前登录队伍value默认选中
  // // loginTeamValue.value = loginStore.loginData.loginInfo.loginTeamValue
  // // 首次请求数据
  // getData()
  // // 设置定时器，每隔5秒请求一次数据
  // timer = setInterval(getData, 3000)
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
  // padding-top: 10.9863rpx /* 15px -> 10.9863rpx */;
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
      padding: 18.3105rpx /* 25px -> 18.3105rpx */ 3% 10.9863rpx /* 15px -> 10.9863rpx */;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 29.2969rpx /* 40px -> 29.2969rpx */;
      font-weight: 700;
      color: rgb(255, 255, 255);
      .homeBtn {
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        // overflow: hidden;
        position: absolute;
        left: 3%;
        width: 10%;
        height: 60%;
        font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
        gap: 3.6621rpx /* 5px -> 3.6621rpx */; /* 图标和文本之间的间距 */
      }
    }
    .studentInfo {
      height: 87%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 18%;
        margin: 0 3%;
        padding: 0 5.8594rpx /* 8px -> 5.8594rpx */;
        background-color: #f8f8f8;
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        .search-info {
          flex: 1;
          // background-color: #007aff;
          height: 100%;
          display: flex;
          align-items: space-between;
          justify-content: space-between;
          flex-wrap: wrap;
          // background-color: aqua;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          .searchInp {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 29.2969rpx /* 40px -> 29.2969rpx */;
            // gap: 73.2422rpx /* 100px -> 73.2422rpx */;
          }
          .inp {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 146.4844rpx /* 200px -> 146.4844rpx */;
            max-height: 100%;
            text {
              color: #000;
              font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
            }
            ::v-deep {
              .uni-easyinput__placeholder-class {
                font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
                color: #8f8f8f;
              }
              .uni-easyinput__content-input {
                height: 21.9727rpx /* 30px -> 21.9727rpx */;
                font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
                padding: 0 1.4648rpx /* 2px -> 1.4648rpx */ !important;
              }
              .uniui-clear {
                font-size: 14.6484rpx /* 20px -> 14.6484rpx */ !important;
              }
              .uni-easyinput {
                .is-input-border {
                  border: 1.4648rpx /* 2px -> 1.4648rpx */ solid #d1d1d1 !important;
                }
                .is-focused {
                  border: 1.4648rpx /* 2px -> 1.4648rpx */ solid #298eff !important;
                }
              }
            }
          }
          .searchDate {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 29.2969rpx /* 40px -> 29.2969rpx */;
          }
          .date {
            display: flex;
            align-items: center;
            justify-content: center;
            // width: 146.4844rpx /* 200px -> 146.4844rpx */;
            max-height: 100%;
            // margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
            text {
              color: #000;
              font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
            }
            ::v-deep {
              .uni-date-x--border {
                border: none;
              }
              .uni-date-x {
                height: 21.9727rpx /* 30px -> 21.9727rpx */;
                width: 109.8633rpx /* 150px -> 109.8633rpx */;
                .uni-icons {
                  font-size: 21.9727rpx /* 30px -> 21.9727rpx */ !important;
                }
              }
              .uni-date-single {
                border: 1.4648rpx /* 2px -> 1.4648rpx */ solid #d1d1d1;
              }
              .uni-date__x-input {
                font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
                color: #000;
              }
              .uni-date__icon-clear {
                .uniui-clear {
                  font-size: 18.3105rpx /* 25px -> 18.3105rpx */ !important;
                }
              }
            }
          }
        }
        .team-box {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          .team-select {
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            display: flex;
            padding: 0 2.1973rpx /* 3px -> 2.1973rpx */;
            // background-color: #92c5c7;
            border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
            width: 183.1055rpx /* 250px -> 183.1055rpx */;
            height: 100%;
            ::v-deep {
              //组件高度
              .uni-stat__select {
                height: 100%;
              }
              //左侧文字
              .uni-label-text {
                font-weight: 400;
                color: #000000;
                font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
              }
              // 右侧下拉
              .uni-select {
                box-sizing: border-box;
                // background-color: #00aaff;
                height: 21.9727rpx /* 30px -> 21.9727rpx */;
                border: 1.4648rpx /* 2px -> 1.4648rpx */ solid #d1d1d1;
              }
              //下拉箭头
              uni-text.uni-icons {
                font-size: 11.7188rpx /* 16px -> 11.7188rpx */ !important;
                color: #d1d1d1 !important;
              }
              //选中项
              .uni-select__input-text {
                width: 91.5527rpx /* 125px -> 91.5527rpx */;
                color: #000;
                font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
              }
              //下拉框中列表内容
              .uni-select__selector-item {
                box-sizing: border-box;
                padding: 0 3.6621rpx /* 5px -> 3.6621rpx */;
                color: #000;
                margin: 3.6621rpx /* 5px -> 3.6621rpx */ 2.1973rpx /* 3px -> 2.1973rpx */;
                height: 20.5078rpx /* 28px -> 20.5078rpx */;
                line-height: 20.5078rpx /* 28px -> 20.5078rpx */;
                border-radius: 5px;
                font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
                background-color: #e9e9e9;
                // border: 1px solid #e5e5e5;
                text {
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
              //下拉最大高度
              .uni-select__selector-scroll {
                background-color: #fff;
                max-height: 317.8711rpx /* 434px -> 317.8711rpx */;
              }
              .uni-select__selector-empty {
                padding: 0 3.6621rpx /* 5px -> 3.6621rpx */;
                margin: 3.6621rpx /* 5px -> 3.6621rpx */ 2.1973rpx /* 3px -> 2.1973rpx */;
                // background-color: #4bbdf7;
                font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
                border-radius: 5px;
              }
            }
          }
          .updata-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 3.6621rpx /* 5px -> 3.6621rpx */;
            padding: 0;
            width: 47.6074rpx /* 65px -> 47.6074rpx */;
            height: 29.2969rpx /* 40px -> 29.2969rpx */;
            font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
            border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
            background-color: #00aaff;
            color: #fff;
          }
        }
      }
      .main {
        max-height: 82%;
        padding: 7.3242rpx /* 10px -> 7.3242rpx */ 3%;
        display: flex;
        flex-direction: column;
        .student-list {
          height: 100%;
          // border: 1px #b8b5b5 solid;
          border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
          overflow-y: auto; /* 添加垂直滚动条 */
          ::v-deep {
            //表头
            .uni-table-th {
              height: 32.959rpx /* 45px -> 32.959rpx */;
              font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
              font-weight: 400;
              color: #000;
              // font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
            }
            //表格
            .uni-table-td {
              font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
              line-height: 16.1133rpx /* 22px -> 16.1133rpx */;
              // height: 29.2969rpx /* 40px -> 29.2969rpx */;
              // white-space: nowrap !important;
              // overflow: hidden;
              // text-overflow: ellipsis;
            }
            .table--border {
              border-color: #e2e2e2;
            }
            .checkbox__inner {
              width: 14.6484rpx /* 20px -> 14.6484rpx */;
              height: 14.6484rpx /* 20px -> 14.6484rpx */;
              border: 1.4648rpx /* 2px -> 1.4648rpx */ #007aff solid;
              overflow: hidden;
            }
            .checkbox__inner-icon {
              box-sizing: border-box;
              position: absolute;
              top: -30px;
              left: 0px;
              width: 14.6484rpx /* 20px -> 14.6484rpx */;
              height: 21.9727rpx /* 30px -> 21.9727rpx */;
              border: 2.1973rpx /* 3px -> 2.1973rpx */ solid #fff;
            }
            .checkbox--indeterminate .checkbox__inner-icon {
              top: 0;
              left: -3px;
              width: 14.6484rpx /* 20px -> 14.6484rpx */;
              height: 14.6484rpx /* 20px -> 14.6484rpx */;
              // background-color: #c61212;
            }
            //暂无数据
            .uni-table-text {
              font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
            }
          }
          .video-btn {
            // margin: 0;
            // padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: #00aaff;
            .video {
              width: 43.9453rpx /* 60px -> 43.9453rpx */;
              margin: 0;
              padding: 0;
              padding: 3.6621rpx /* 5px -> 3.6621rpx */;
              background-color: rgba(0, 157, 255, 0.1);
              font-size: 8.7891rpx /* 12px -> 8.7891rpx */;
              color: #00aaff;
              border: #00aaff 1px solid;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
