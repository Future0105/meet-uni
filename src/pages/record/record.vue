<template>
  <view class="container">
    <Media v-if="showMedia" @cancel="onCancel" />
    <view class="layout">
      <view class="title">
        <button class="homeBtn" @click="redirectTo(`/pages/index/index`)">
          <uni-icons type="home" size="50"></uni-icons>
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
              <view class="team-select">
                <uni-data-select
                  label="年份查询"
                  placeholder="选择查询年份"
                  :clear="true"
                  emptyTips="暂无数据"
                  v-model="selectYear"
                  :localdata="searchYear"
                  @change="selectYearChange"
                ></uni-data-select>
              </view>
            </view>
            <view class="searchDate">
              <view class="student-address inp">
                <text>住址：</text>
                <uni-easyinput v-model="searchAddress" placeholder="请输入家庭住址"></uni-easyinput>
              </view>
              <view class="team-select">
                <uni-data-select
                  label="月份查询"
                  placeholder="选择查询月份"
                  :clear="true"
                  emptyTips="暂无数据"
                  v-model="selectMonth"
                  :localdata="searchMonth"
                  @change="selectMonthChange"
                ></uni-data-select>
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
                <uni-th width="270" align="center">学员身份证号</uni-th>
                <uni-th width="85" align="center">学员状态</uni-th>
                <uni-th width="200" align="center">所在大队</uni-th>
                <uni-th width="200" align="center">探访家属</uni-th>
                <uni-th width="150" align="center">申请时间</uni-th>
                <uni-th width="150" align="center">探访时间</uni-th>
                <uni-th width="130" align="center">探访窗口</uni-th>
                <uni-th width="80" align="center">操作</uni-th>
              </uni-tr>
              <uni-tr v-for="(item, index) in recordList" :key="item.studentId">
                <uni-td align="center">{{ item.name }}</uni-td>
                <uni-td align="center">{{ item.num }}</uni-td>
                <uni-td align="center">{{ item.teamName }}</uni-td>
                <uni-td align="center">{{ item.address }}</uni-td>
                <uni-td align="center">{{ item.status }}</uni-td>
                <uni-td align="center">{{ item.info }}</uni-td>
                <uni-td align="center">{{ item.z }}</uni-td>
                <uni-td align="center">{{ item.zaidui }}</uni-td>
                <uni-td>
                  <view class="media-btn">
                    <!-- <button @click="getMedia(item.studentId)" class="media" size="mini">录像回放</button> -->
                    <button @click="getMedia(item.studentId)" class="media" size="mini">录音回放</button>
                  </view>
                  <view class="audio-btn"> </view>
                </uni-td>
              </uni-tr>
            </uni-table>
          </view>
          <!-- 分页器 -->
          <view class="uni-pagination-box">
            <uni-pagination
              show-icon
              :page-size="pageSize"
              :current="pageCurrent"
              :total="total"
              @change="changePage"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// import HeadFill from '../../components/HeadFill/HeadFill.vue'
import Media from './Media.vue'
import { getRecordList_API } from '@/api/data'
import { userLoginStore } from '@/store/login.js'
import { redirectTo } from '@/utils/to.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { debounce, throttle } from 'lodash' //防抖与节流
import { ref } from 'vue'
//名字搜索
const searchName = ref('')
//地址搜索
const searchAddress = ref('')
//所有队伍列表
const teamsList = ref([])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(0)
//媒体回放弹窗
const showMedia = ref(false)
//对应学员记录
const medieStudentId = ref(null)
//年份
const searchYear = ref([
  { value: 2024, text: '2024' },
  { value: 2025, text: '2025' },
  { value: 2026, text: '2026' },
  { value: 2027, text: '2027' },
  { value: 2028, text: '2028' },
  { value: 2029, text: '2029' },
  { value: 2030, text: '2030' },
  { value: 2031, text: '2031' },
  { value: 2032, text: '2032' },
  { value: 2033, text: '2033' },
  { value: 2034, text: '2034' }
])
const selectYear = ref(0)
//月份
const searchMonth = ref([
  { value: 1, text: '1月' },
  { value: 2, text: '2月' },
  { value: 3, text: '3月' },
  { value: 4, text: '4月' },
  { value: 5, text: '5月' },
  { value: 6, text: '6月' },
  { value: 7, text: '7月' },
  { value: 8, text: '8月' },
  { value: 9, text: '9月' },
  { value: 10, text: '10月' },
  { value: 11, text: '11月' },
  { value: 12, text: '12月' }
])
const selectMonth = ref(0)
const recordList = ref([])
//下拉框更改部门查询学员
const teamListChange = async e => {
  if (e) {
    selectTeam.value = e // e 为选中的部门id
  } else {
    selectTeam.value = 0 // 0 所有部门
  }
}
//选择年份
const selectYearChange = e => {
  if (e) {
    selectYear.value = e
  } else {
    selectYear.value = 0
  }
}
//选择月份
const selectMonthChange = e => {
  if (e) {
    selectMonth.value = e
  } else {
    selectMonth.value = 0
  }
}
//探访记录
const getRecordList = async (data = {}) => {
  const recordListRes = await getRecordList_API(data)
  if (recordListRes.code === 200) {
    recordList.value = recordListRes.data
    // console.log(recordList.value)
  } else {
    uni.showToast({
      title: '获取探访记录失败',
      icon: 'none'
    })
  }
}

const updata = async () => {
  teamsList.value = [
    { value: 1, text: '教育矫治所' },
    { value: 2, text: '一大队' },
    { value: 3, text: '二大队' },
    { value: 4, text: '三大队' },
    { value: 5, text: '安保大队' }
  ]
  recordList.value = [
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
  await getRecordList()
}

//录像回放
const getMedia = Id => {
  showMedia.value = true //媒体弹窗
  medieStudentId.value = Id // 学员Id
  // uni.showToast({
  //   title: '媒体',
  //   icon: 'none',
  //   duration: 2000
  // })
}
//弹窗关闭操作
const onCancel = () => {
  showMedia.value = false ////隐藏民警信息弹窗
}
//一页数据量
const pageSize = 6
// 当前页码
const pageCurrent = ref(1)
//数据总数
const total = ref(0)
// const total = computed(() => recordList.value.length)
//总页数,Math.ceil() 函数将结果向上取整
// const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

// // 计算属性，用于获取当前页的数据
// const paginatedData = computed(() => {
//   const start = (pageCurrent.value - 1) * pageSize
//   const end = pageCurrent.value * pageSize
//   return recordList.value.slice(start, end)
// })
// 页码变化时的处理函数
const changePage = async page => {
  pageCurrent.value = page.current
  await getRecordList({
    RealName: searchName.value,
    DepartPath: searchAddress.value,
    CollegeId: selectTeam.value,
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
    PageShowNum: pageSize,
    PageNum: pageCurrent.value
  })
}
onLoad(async () => {
  const loginStore = userLoginStore()
  // 部门列表
  teamsList.value = loginStore.teamsList
  //根据登录信息,匹配默认选中部门
  if (teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId)) {
    selectTeam.value = teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId).value
  }
  await getRecordList()
  // await getTodayOutList({ CollegeId: selectTeam.value })
  // // 设置定时器，每隔5秒请求一次数据
  // timer = setInterval(getData, 3000)
})
// let timer = null
// const clearTimer = () => {
//   if (timer) {
//     clearInterval(timer)
//     timer = null
//     console.log('探访记录,定时器已清除')
//   }
// }
// // 页面卸载时触发 redirectTo卸载,navigateTo保留
// onUnload(clearTimer)
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
    padding-top: 5.127rpx /* 7px -> 5.127rpx */;
    .title {
      position: relative;
      width: 100vw;
      height: 10%;
      // margin-top: 7.3242rpx /* 10px -> 7.3242rpx */;
      // padding: 7.3242rpx /* 10px -> 7.3242rpx */ 3% 7.3242rpx /* 10px -> 7.3242rpx */;
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
        height: 75%;
        font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
        gap: 3.6621rpx /* 5px -> 3.6621rpx */; /* 图标和文本之间的间距 */
        ::v-deep {
          .uni-icons {
            font-size: 21.9727rpx /* 30px -> 21.9727rpx */ !important;
          }
        }
      }
    }
    .studentInfo {
      height: 90%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 16%;
        margin: 0 3%;
        padding: 0 10.9863rpx /* 15px -> 10.9863rpx */;
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
        }
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
            .uni-select__input-placeholder {
              color: #999999;
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
        .team-box {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
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
            text {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            ::v-deep {
              .uni-icons {
                font-size: 16.1133rpx /* 22px -> 16.1133rpx */ !important;
              }
            }
          }
        }
      }
      .main {
        height: 84%;
        padding: 7.3242rpx /* 10px -> 7.3242rpx */ 3% 5.8594rpx /* 8px -> 5.8594rpx */;
        display: flex;
        flex-direction: column;
        .student-list {
          // height: 100%;
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
          .media-btn {
            // margin: 0;
            // padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: #00aaff;
            .media {
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
        .uni-pagination-box {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 25.6348rpx /* 35px -> 25.6348rpx */;
          margin-top: 3.6621rpx /* 5px -> 3.6621rpx */;
          display: flex;
          align-items: center;
          justify-content: center;
          ::v-deep {
            .uni-pagination {
              height: 25.6348rpx /* 35px -> 25.6348rpx */;
            }
            //左右按钮
            .uni-pagination__btn {
              width: 21.9727rpx /* 30px -> 21.9727rpx */;
              height: 20.5078rpx /* 28px -> 20.5078rpx */;
              font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
              // background-color: #ce0c0c !important;
              .uni-icons {
                font-size: 13.1836rpx /* 18px -> 13.1836rpx */ !important;
              }
            }
            //页数按钮
            .uni-pagination__num-tag {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
              width: 21.9727rpx /* 30px -> 21.9727rpx */;
              height: 20.5078rpx /* 28px -> 20.5078rpx */;
            }
            //分页器总数据
            .uni-pagination__total {
              display: none;
              font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
