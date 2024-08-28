<template>
  <view class="studentInfo">
    <view class="header">
      <view class="search-info">
        <view class="student-name inp">
          <text>姓名：</text>
          <uni-easyinput v-model="searchName" placeholder="请输入学员姓名"></uni-easyinput>
        </view>
        <view class="student-address inp">
          <text>住址：</text>
          <uni-easyinput v-model="searchAddress" placeholder="请输入家庭地址"></uni-easyinput>
        </view>
      </view>
      <view class="team-select">
        <uni-data-select
          label="所在大队"
          placeholder="所有部门"
          emptyTips="暂无数据"
          v-model="selectTeam"
          :clear="true"
          :localdata="teamsList"
          @change="teamChange"
        ></uni-data-select>
      </view>
      <view class="data-show">
        <uni-data-checkbox @change="showDataChange" v-model="show" :localdata="showData"></uni-data-checkbox>
      </view>
      <button class="updata-btn search" @click="updata">
        <uni-icons type="search" color="#fff" size="35"></uni-icons><text>搜索</text>
      </button>
      <button class="updata-btn reload" @click="updata">
        <uni-icons type="reload" color="#fff" size="35"></uni-icons><text>刷新</text>
      </button>
    </view>
    <view class="main">
      <view class="student-list">
        <uni-table border emptyText="暂无更多数据">
          <uni-tr>
            <!-- <uni-th width="65" align="center">姓名</uni-th>
            <uni-th width="165" align="center">身份证号</uni-th>
            <uni-th width="50" align="center">性别</uni-th>
            <uni-th width="100" align="center">家庭住址</uni-th>
            <uni-th width="100" align="center">所在大队</uni-th>
            <uni-th width="50" align="center">关注等级</uni-th>
            <uni-th width="50" align="center">学员状态</uni-th>
            <uni-th width="50" align="center">在队状态</uni-th>
            <uni-th width="90" align="center">入所时间</uni-th>
            <uni-th width="90" align="center">解教时间</uni-th>
            <uni-th width="20" align="center">操作</uni-th> -->
            <uni-th width="110" align="center">姓名</uni-th>
            <uni-th width="" align="center">身份证号</uni-th>
            <uni-th width="60" align="center">性别</uni-th>
            <uni-th width="280" align="center">家庭住址</uni-th>
            <uni-th width="150" align="center">所在大队</uni-th>
            <uni-th width="80" align="center">关注等级</uni-th>
            <uni-th width="80" align="center">学员状态</uni-th>
            <uni-th width="80" align="center">在队状态</uni-th>
            <uni-th width="150" align="center">入所时间</uni-th>
            <uni-th width="150" align="center">解教时间</uni-th>
            <uni-th width="90" align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="item in studentsList" :key="item.Id">
            <uni-td align="center" :class="{ face: item.IsFace === 1 }">{{ item.RealName }}</uni-td>
            <uni-td align="center">
              {{ item.IDCardNo }}
              <!-- <text style="padding: 0 3.6621rpx" v-for="(family, index) in item.familyName" :key="index">
                {{ family }}
              </text> -->
            </uni-td>
            <uni-td align="center">{{ item.Sex }}</uni-td>
            <uni-td align="center">{{ item.DepartPath }}</uni-td>
            <uni-td align="center">{{ item.CollegeName }}</uni-td>
            <uni-td align="center">{{ item.AttentLevelName }}</uni-td>
            <uni-td align="center">{{ item.CadetStateName }}</uni-td>
            <uni-td align="center">{{ item.InTeamStateName }}</uni-td>
            <uni-td align="center">{{ item.FrozenDateTime }}</uni-td>
            <uni-td align="center">{{ item.RoundTime }}</uni-td>
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
import { getStudentsInfo_API } from '@/api/data'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { userLoginStore } from '@/store/login.js'
import { debounce, throttle } from 'lodash' //防抖与节流

//学员列表
const studentsList = ref([])
//所有队伍列表
const teamsList = ref([])
//名字搜索
const searchName = ref('')
//地址搜索
const searchAddress = ref('')
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

//一页十条
const pageSize = 6
// 当前页码
const pageCurrent = ref(1)
//数据总数
const total = ref(0)
// const total = computed(() => studentsList.value.length)
//总页数,Math.ceil() 函数将结果向上取整
// const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

// // 计算属性，用于获取当前页的数据
// const paginatedData = computed(() => {
//   const start = (pageCurrent.value - 1) * pageSize
//   const end = pageCurrent.value * pageSize
//   return studentsList.value.slice(start, end)
// })
// 页码变化时的处理函数
const changePage = async page => {
  pageCurrent.value = page.current
  await getStudentsInfo({
    RealName: searchName.value,
    DepartPath: searchAddress.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
    PageShowNum: pageSize,
    PageNum: pageCurrent.value
  })
}
//获取学员信息
const getStudentsInfo = async (data = {}) => {
  const studentsInfoRes = await getStudentsInfo_API(data)
  if (studentsInfoRes.code === 200) {
    // total.value = studentsInfoRes.message
    total.value = studentsInfoRes.message * pageSize
    studentsList.value = studentsInfoRes.data
  } else {
    uni.showToast({
      title: '获取学员信息失败',
      icon: 'none'
    })
  }
}
onLoad(async () => {
  const loginStore = userLoginStore()
  // 部门列表
  teamsList.value = loginStore.teamsList
  //根据登录信息,匹配默认选中部门
  if (teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId)) {
    selectTeam.value = teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId).value
  }
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
  await getStudentsInfo({
    RealName: searchName.value,
    DepartPath: searchAddress.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
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
  // console.log('SearchType:', show.value)
  pageCurrent.value = 1
  await getStudentsInfo({
    RealName: searchName.value,
    DepartPath: searchAddress.value,
    CollegeId: selectTeam.value,
    SearchType: show.value,
    // PageShowNum：每页显示的数据条数：默认7，PageNum：当前页码：默认1
    PageShowNum: pageSize,
    PageNum: pageCurrent.value
  })

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
//人脸采集 防抖必须停止触发行为后才可以再次触发
//leading延迟开始前调用  trailing延迟结束后调用
const getFace = debounce(
  Id => {
    if (uni.getSystemInfoSync().platform === 'android') {
      window.android.H5ToAndroid(
        JSON.stringify({
          type: 'FACE_COLLECT_BY_ID',
          Id
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // gap: 10.9863rpx /* 15px -> 10.9863rpx */;
    height: 43.9453rpx /* 60px -> 43.9453rpx */;
    padding: 7.3242rpx /* 10px -> 7.3242rpx */ 5.8594rpx /* 8px -> 5.8594rpx */;
    margin: 0 /* 8px -> 5.8594rpx */ 3%;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    background-color: #f8f8f8;
    // background-color: #f8f8f8;
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
          color: #2979ff;
        }
        .checklist-content .checklist-text {
          font-size: 9.5215rpx /* 13px -> 9.5215rpx */;
          color: #000;
        }
        .checklist-box .radio__inner {
          width: 10.9863rpx /* 15px -> 10.9863rpx */;
          height: 10.9863rpx /* 15px -> 10.9863rpx */;
          background-color: #fff;
          border-color: #000;
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
    .student-list {
      // max-height: 100%;
      // border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
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
          display: none;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          color: #fff;
        }
      }
    }
  }
  .face {
    color: #faaa33;
  }
}
</style>
