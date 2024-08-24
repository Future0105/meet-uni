<template>
  <view class="studentInfo">
    <view class="header">
      <view class="search-info">
        <view class="student-name inp">
          <text>姓名：</text>
          <uni-easyinput v-model="searchName" placeholder="请输入姓名"></uni-easyinput>
        </view>
        <view class="student-teacherId inp">
          <text>警号：</text>
          <uni-easyinput v-model="searchTeacherId" placeholder="请输入警号"></uni-easyinput>
        </view>
      </view>
      <view class="team-select">
        <uni-data-select
          label="所在大队"
          placeholder="请选择组织"
          emptyTips="暂无数据"
          v-model="selectTeam"
          :clear="false"
          :localdata="teamsList"
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
      <button class="updata-btn search" @click="updata">
        <uni-icons type="search" color="#fff" size="40"></uni-icons><text>搜索</text>
      </button>
      <button class="updata-btn reload" @click="updata">
        <uni-icons type="reload" color="#fff" size="40"></uni-icons><text>刷新</text>
      </button>
    </view>
    <view class="main">
      <view class="teacher-list">
        <uni-table border stripe emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="100" align="center">姓名</uni-th>
            <uni-th width="180" align="center">警号</uni-th>
            <uni-th width="120" align="center">重名标识</uni-th>
            <uni-th width="60" align="center">性别</uni-th>
            <uni-th width="150" align="center">所在部门</uni-th>
            <uni-th width="180" align="center">联系电话</uni-th>
            <uni-th width="120" align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="item in paginatedData" :key="item.Id">
            <uni-td align="center">{{ item.RealName }}</uni-td>
            <uni-td align="center">{{ item.PersonNo }}</uni-td>
            <uni-td align="center">{{ item.Remark }}</uni-td>
            <uni-td align="center">{{ item.Sex }}</uni-td>
            <uni-td align="center">{{ item.CollegeName }}</uni-td>
            <uni-td align="center">{{ item.Phone }}</uni-td>
            <uni-td>
              <view class="face-btn">
                <button @click="getFace(item.Id)" class="face" size="mini">人脸采集</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 分页器 -->
      <view class="uni-pagination-box">
        <uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="changePage" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { getTeachersInfo_API } from '@/api/data'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { userLoginStore } from '@/store/login.js'
import { debounce, throttle } from 'lodash' //防抖与节流
//学员列表
const teachersList = ref([])
//所有队伍列表
const teamsList = ref([])
//名字搜索
const searchName = ref('')
//警号搜索
const searchTeacherId = ref('')
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref('')
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
//一页数据量
const pageSize = 7
// 当前页码
const pageCurrent = ref(1)
//数据总数
// const total = ref(0)
const total = computed(() => teachersList.value.length)
//获取民警信息
const getTeachersInfo = async (data = {}) => {
  const teachersInfoRes = await getTeachersInfo_API(data)
  if (teachersInfoRes.code === 200) {
    total.value = teachersInfoRes.message
    teachersList.value = teachersInfoRes.data
    console.log(teachersList.value)
  } else {
    uni.showToast({
      title: '获取民警信息失败',
      icon: 'none'
    })
  }
}

// //总页数,Math.ceil() 函数将结果向上取整
// const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

// 计算属性，用于获取当前页的数据
const paginatedData = computed(() => {
  const start = (pageCurrent.value - 1) * pageSize
  const end = pageCurrent.value * pageSize
  return teachersList.value.slice(start, end)
})

// 页码变化时的处理函数
const changePage = async page => {
  pageCurrent.value = page.current
  await getTeachersInfo({
    RealName: searchName.value,
    PersonNo: searchTeacherId.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
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
  // RealName=李涛 & PersonNo=100016110& CollegeId=0& SearchType=0
  await getTeachersInfo({
    RealName: searchName.value,
    PersonNo: searchTeacherId.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
    PageShowNum: pageSize,
    PageNum: pageCurrent.value
  })
})

//改变队伍
const teamChange = e => {
  selectTeam.value = e
}
//改变展示数据条件
const showDataChange = e => {
  show.value = e.detail.value
}
const updata = async () => {
  // await getTeachersInfo({
  //   RealName: '李涛',
  //   PersonNo: '100016110',
  //   CollegeId: 0,
  //   SearchType: 0
  // })

  teachersList.value = [
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    },
    {
      CollegeName: '一大队',
      Id: 4350,
      PersonNo: '100016110',
      Phone: '13618206431',
      RealName: '李涛',
      Remark: '李涛重名标识',
      Sex: '男'
    }
  ]
  pageCurrent.value = 1
  await getTeachersInfo({
    RealName: searchName.value,
    PersonNo: searchTeacherId.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
    PageShowNum: pageSize,
    PageNum: pageCurrent.value
  })
  // uni
  //   .request({
  //     url: `http://23.84.142.247:90/api/WisdomVisit/Pad_GetPolicemanInfoList?RealName=''&SearchType=0`
  //   })
  //   .then(res => {
  //     console.log('民警信息获取', res)
  //   })
}
//人脸采集
//leading延迟开始前调用  trailing延迟结束后调用
const getFace = debounce(
  id => {
    if (uni.getSystemInfoSync().platform === 'android') {
      window.android.H5ToAndroid(
        JSON.stringify({
          type: 'FACE_COLLECT_BY_ID',
          Id: '177'
        })
      )
    }
  },
  1000,
  { leading: true, trailing: false }
)
</script>

<style lang="scss" scoped>
.studentInfo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // gap: 10.9863rpx /* 15px -> 10.9863rpx */;
    height: 43.9453rpx /* 60px -> 43.9453rpx */;
    padding: 7.3242rpx /* 10px -> 7.3242rpx */ 5.8594rpx /* 8px -> 5.8594rpx */;
    margin: 0 /* 8px -> 5.8594rpx */ 3%;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    background-color: rgba(214, 223, 226, 0.3);
    // overflow: hidden;
    .updata-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 3.6621rpx /* 5px -> 3.6621rpx */;
      padding: 0;
      width: 47.6074rpx /* 65px -> 47.6074rpx */;
      height: 100%;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
      border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      background-color: #00aaff;
      color: #fff;
    }
    .search-info {
      display: flex;
      // background-color: aqua;
      font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
      max-height: 100%;
      .inp {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 114.2578rpx /* 156px -> 114.2578rpx */;
        max-height: 100%;
        margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
        text {
          color: #fff;
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
          }
          .uniui-clear {
            font-size: 14.6484rpx /* 20px -> 14.6484rpx */ !important;
          }
        }
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
          font-weight: 600;
          color: #ffffff;
          font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
        }
        // 右侧下拉
        .uni-select {
          box-sizing: border-box;
          // background-color: #00aaff;
          height: 21.9727rpx /* 30px -> 21.9727rpx */;
          border: 1.4648rpx /* 2px -> 1.4648rpx */ solid #ffffff;
        }
        //下拉箭头
        uni-text.uni-icons {
          font-size: 10.9863rpx /* 15px -> 10.9863rpx */ !important;
          color: #ffffff !important;
        }
        //选中项
        .uni-select__input-text {
          width: 91.5527rpx /* 125px -> 91.5527rpx */;
          color: #ffffff;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        }
        //下拉框中列表内容
        .uni-select__selector-item {
          box-sizing: border-box;
          padding: 0 3.6621rpx /* 5px -> 3.6621rpx */;
          color: #ffffff;
          margin: 3.6621rpx /* 5px -> 3.6621rpx */ 2.1973rpx /* 3px -> 2.1973rpx */;
          height: 20.5078rpx /* 28px -> 20.5078rpx */;
          line-height: 20.5078rpx /* 28px -> 20.5078rpx */;
          border-radius: 5px;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          background-color: #4bbdf7;
          // border: 1px solid #e5e5e5;
          text {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        //下拉最大高度
        .uni-select__selector-scroll {
          background-color: #e4e4e4;
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
    .data-show {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // height: 100%;
      // width: 139.1602rpx /* 190px -> 139.1602rpx */;
      max-height: 100%;
      // background-color: rgb(216, 141, 27);
      padding: 0;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      ::v-deep {
        .checklist-box {
          margin: 2.9297rpx /* 4px -> 2.9297rpx */;
        }
        .checklist-box.is--default.is-checked .checklist-text {
          color: #000000;
        }
        .checklist-content .checklist-text {
          font-size: 9.5215rpx /* 13px -> 9.5215rpx */;
          color: #ffffff;
        }
        .checklist-box .radio__inner {
          width: 10.9863rpx /* 15px -> 10.9863rpx */;
          height: 10.9863rpx /* 15px -> 10.9863rpx */;
          background-color: #fff;
          .radio__inner-icon {
            width: 5.8594rpx /* 8px -> 5.8594rpx */;
            height: 5.8594rpx; /* 8px -> 5.8594rpx */
          }
        }
      }
    }
  }
  .main {
    flex: 1;
    padding: 7.3242rpx /* 10px -> 7.3242rpx */ 3%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .teacher-list {
      // max-height: 100%;
      // border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow-y: auto; /* 添加垂直滚动条 */
      ::v-deep {
        //表头
        .uni-table-th {
          height: 32.959rpx /* 45px -> 32.959rpx */;
          font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
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
          left: -7.3242rpx /* -10px -> -7.3242rpx */;
          width: 29.2969rpx /* 40px -> 29.2969rpx */;
          height: 29.2969rpx /* 40px -> 29.2969rpx */;
          background-color: #fff;
          // background-color: #c61212;
        }
        //暂无数据
        .uni-table-text {
          font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
        }
      }
      .face-btn {
        // margin: 0;
        // padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: #00aaff;
        .face {
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
      margin-top: 2.1973rpx /* 3px -> 2.1973rpx */;
      display: flex;
      align-items: center;
      justify-content: center;
      ::v-deep {
        .uni-pagination {
          height: 25.6348rpx /* 35px -> 25.6348rpx */;
        }
        //左右按钮
        .uni-pagination__btn {
          width: 20.5078rpx /* 28px -> 20.5078rpx */;
          height: 18.3105rpx /* 25px -> 18.3105rpx */;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          // background-color: #ce0c0c !important;
          .uni-icons {
            font-size: 11.7188rpx /* 16px -> 11.7188rpx */ !important;
          }
        }
        //页数按钮
        .uni-pagination__num-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          width: 20.5078rpx /* 28px -> 20.5078rpx */;
          height: 18.3105rpx /* 25px -> 18.3105rpx */;
        }
        //分页器总数据
        .uni-pagination__total {
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          color: #fff;
        }
      }
    }
  }
}
</style>
