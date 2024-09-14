<template>
  <view class="todayOut">
    <view class="header">
      <view class="team-box">
        <view class="team-select">
          <uni-data-select
            label="所在大队"
            placeholder="所有部门"
            :clear="true"
            emptyTips="暂无数据"
            v-model="selectTeam"
            :localdata="teamsList"
            @change="teamChange"
          ></uni-data-select>
        </view>
        <button class="updata-btn search" @click="updata">
          <uni-icons type="search" color="#fff" size="35"></uni-icons><text>搜索</text>
        </button>
        <button class="updata-btn reload" @click="updata">
          <uni-icons type="reload" color="#fff" size="35"></uni-icons><text>刷新</text>
        </button>
      </view>

      <view class="header-title">
        <text>今日已带出 {{ outNumber }} 个学员</text>
      </view>
    </view>
    <view class="main">
      <view class="student-list">
        <uni-table :border="true" emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="200" align="center">学员姓名</uni-th>
            <uni-th width="250" align="center">申请会见家属</uni-th>
            <uni-th width="250" align="center">学员所在大队</uni-th>
            <uni-th width="400" align="center">学员家庭住址</uni-th>
          </uni-tr>
          <uni-tr v-for="item in studentsList" :key="item.Id">
            <uni-td align="center">{{ item.CadetName }}</uni-td>
            <uni-td align="center">{{ item.KinName }}</uni-td>
            <uni-td align="center">{{ item.CollegeName }}</uni-td>
            <uni-td align="center">{{ item.DepartPath }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getTodayOutList_API } from '@/api/data'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { userLoginStore } from '@/store/login.js'
//所有队伍列表
const teamsList = ref([])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(0)
//带出学员列表
const studentsList = ref([])
//今日带出人数
const outNumber = ref(0)

//获取今日带出学员数据
const getTodayOutList = async (data = {}) => {
  const todayOutListRes = await getTodayOutList_API(data)
  if (todayOutListRes.code === 200) {
    studentsList.value = todayOutListRes.data
    if (studentsList.value) {
      outNumber.value = studentsList.value.length
    }
    // console.log(studentsList.value)
  } else {
    uni.showToast({
      title: '获取今日带出学员列表失败',
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
  await getTodayOutList({ CollegeId: selectTeam.value })
})
//改变队伍
const teamChange = e => {
  if (e) {
    selectTeam.value = e // e 为选中的部门id
  } else {
    selectTeam.value = 0 // 0 所有部门
  }
}
const updata = async () => {
  // teamsList.value = [
  //   { value: 1, text: '教育矫治所' },
  //   { value: 2, text: '一大队' },
  //   { value: 3, text: '二大队' },
  //   { value: 4, text: '三大队' },
  //   { value: 5, text: '安保大队' }
  // ]
  // studentsList.value = [
  //   {
  //     Id: 1001,
  //     CadetName: '张三张三张三张三张三张三张三',
  //     KinName: '张三张三张三张三张三张三张三',
  //     CollegeName: '一大一大队一大队一大队一大队队',
  //     DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '广东省深圳市龙岗区',
  //     KinName: '广东省深圳市龙岗区',
  //     CollegeName: '广东省深圳市龙岗区',
  //     DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '广东省深圳市龙岗区',
  //     KinName: '广东省深圳市龙岗区',
  //     CollegeName: '广东省深圳市龙岗区',
  //     DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '广东省深圳市龙岗区',
  //     KinName: '广东省深圳市龙岗区',
  //     CollegeName: '广东省深圳市龙岗区',
  //     DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '广东省深圳市龙岗区',
  //     KinName: '广东省深圳市龙岗区',
  //     CollegeName: '广东省深圳市龙岗区',
  //     DepartPath: '广东省深圳市龙岗区广东省深圳市龙岗区广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '张三',
  //     KinName: '张三',
  //     CollegeName: '一大队',
  //     DepartPath: '广东省深圳市龙岗区'
  //   }
  // ]
  await getTodayOutList({ CollegeId: selectTeam.value })
}
</script>

<style lang="scss" scoped>
.todayOut {
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
    background-color: #f8f8f8;
    // overflow: hidden;
    .team-box {
      display: flex;
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
      .updata-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 3.6621rpx /* 5px -> 3.6621rpx */;
        padding: 0;
        width: 47.6074rpx /* 65px -> 47.6074rpx */;
        height: 100%;
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
    .header-title {
      flex: 5;
      max-height: 100%;
      margin-left: 21.9727rpx /* 30px -> 21.9727rpx */;
      font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
      color: #000;
    }
  }
  .main {
    flex: 1;
    padding: 7.3242rpx /* 10px -> 7.3242rpx */ 3%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .student-list {
      height: 100%;
      // border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow: auto; /* 添加垂直滚动条 */
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
    }
  }
}
</style>
