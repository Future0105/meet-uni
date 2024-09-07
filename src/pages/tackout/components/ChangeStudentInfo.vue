<!-- CustomModal.vue -->
<template>
  <view class="Info">
    <view class="modal" @click.stop>
      <view class="modal-header">学员信息 </view>
      <view class="modal-content">
        <view class="modal-content-info">
          <view class="tips"> <text style="color: red">*</text>星号内容不可修改 </view>
          <view class="student info">
            <view class="student-name inp">
              <text style="color: red">*</text>
              <text>学员姓名：</text>
              <uni-easyinput v-model="studentName" disabled placeholder="学员姓名"></uni-easyinput>
            </view>
            <view class="student-id inp">
              <text style="color: red">*</text>
              <text>身份证号：</text>
              <uni-easyinput v-model="studentId" disabled placeholder="学员身份证号"></uni-easyinput>
            </view>
          </view>
          <view class="time info">
            <view class="time-start date">
              <text style="color: transparent">*</text>
              <text>入所时间：</text>
              <uni-datetime-picker type="date" :clear-icon="true" v-model="startTime" @change="changeStartTime" />
            </view>
            <view class="time-end date">
              <text style="color: transparent">*</text>
              <text>解教时间：</text>
              <uni-datetime-picker type="date" :clear-icon="true" v-model="endTime" @change="changeEndTime" />
            </view>
          </view>
          <view class="sex info">
            <view class="student-sex team-select">
              <uni-data-select
                label="学员性别"
                placeholder="请选择性别"
                :clear="true"
                emptyTips="暂无数据"
                v-model="studentSex"
                :localdata="studentSexList"
                @change="changeStudentSex"
              ></uni-data-select>
            </view>
            <view class="student-team team-select">
              <uni-data-select
                label="所在大队"
                placeholder="请选择部门"
                :clear="true"
                emptyTips="暂无数据"
                v-model="selectTeam"
                :localdata="teamsList"
                @change="changeTeam"
              ></uni-data-select>
            </view>
          </view>
          <view class="state info">
            <view class="student-state team-select">
              <uni-data-select
                label="学员状态"
                placeholder="请选择学员状态"
                :clear="true"
                emptyTips="暂无数据"
                v-model="studentState"
                :localdata="studentStateList"
                @change="changeStudentState"
              ></uni-data-select>
            </view>
            <view class="team-state team-select">
              <uni-data-select
                label="在队状态"
                placeholder="请选择在队状态"
                :clear="true"
                emptyTips="暂无数据"
                v-model="teamState"
                :localdata="teamStateList"
                @change="changeTeamState"
              ></uni-data-select>
            </view>
          </view>
          <view class="level info">
            <view class="student-level team-select">
              <uni-data-select
                label="关注等级"
                placeholder="请选择关注等级"
                :clear="true"
                emptyTips="暂无数据"
                v-model="levelState"
                :localdata="levelStateList"
                @change="changeLevelState"
              ></uni-data-select>
            </view>
          </view>
          <view class="address info">
            <view class="student-address inp">
              <text style="color: transparent">*</text>
              <text>家庭住址：</text>
              <uni-easyinput v-model="studentAddress" placeholder="请输入家庭住址"></uni-easyinput>
            </view>
          </view>
        </view>
        <view class="modal-content-img">
          <view class="zj-img img">
            <image src="@/static/image/logo/small.png" mode="scaleToFill" />
            <text>证件照</text>
          </view>
          <view class="face-img img">
            <image src="@/static/image/logo/small.png" mode="scaleToFill" />
            <text>人脸识别照</text>
          </view>
        </view>
      </view>
      <view class="modal-footer">
        <button class="btn" @click="handleCancel">取消</button>
        <button class="btn confirm" @click="handleConfirm">保存</button>
      </view>
    </view>
  </view>
</template>

<script setup>
// import { getReasonsList_API } from '@/api/data.js'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// defineProps({
//   way: {
//     tppe: Boolean,
//     default: true
//   }
// })
const studentName = ref('张三')
const studentId = ref('500222190010101234')
const startTime = ref('')
const endTime = ref('')
const studentSex = ref('')
const studentSexList = ref([
  { value: 0, text: '男' },
  { value: 1, text: '女' }
])
//所有队伍列表
const teamsList = ref([
  { value: 331, text: '一大队' },
  { value: 332, text: '二大队' },
  { value: 333, text: '三大队' },
  { value: 334, text: '四大队' },
  { value: 335, text: '五大队' },
  { value: 336, text: '六大队' },
  { value: 1332, text: '七大队' }
])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(null)

const studentState = ref('')
const studentStateList = ref([
  { value: 331, text: '生病' },
  { value: 332, text: '住院' },
  { value: 333, text: '不听话' },
  { value: 334, text: '禁闭' }
])
const teamState = ref('')
const teamStateList = ref([
  { value: 331, text: '一大队' },
  { value: 332, text: '拘留' },
  { value: 333, text: '出勤' },
  { value: 334, text: '未在大队' }
])

const levelState = ref('')
const levelStateList = ref([
  { value: 331, text: '一级' },
  { value: 332, text: '二级' },
  { value: 333, text: '三级' }
])
const studentAddress = ref('')
//返回确认和取消操作给父级
const emits = defineEmits(['confirm', 'cancel'])
//入所时间
const changeStartTime = e => {
  startTime.value = e
  console.log(startTime.value)
}
//解教时间
const changeEndTime = e => {
  endTime.value = e
  console.log(endTime.value)
}
//性别
const changeStudentSex = e => {
  studentSex.value = e
  console.log(studentSex.value)
}
//部门
const changeTeam = async e => {
  selectTeam.value = e // e 为选中的部门id
  console.log(selectTeam.value)
}
//学员状态
const changeStudentState = e => {
  studentSex.value = e
  console.log(studentSex.value)
}
//在队状态
const changeTeamState = e => {
  studentSex.value = e
  console.log(studentSex.value)
}
const changeLevelState = e => {
  levelState.value = e
  console.log(levelState.value)
}
//获取不带出理由列表
// const getReasonsList = async () => {
//   const reasonstRes = await getReasonsList_API()
//   if (reasonstRes.code === 200) {
//     reasons.value = reasonstRes.data
//   } else {
//     uni.showToast({
//       title: '获取不带出理由列表失败',
//       icon: 'none'
//     })
//   }
// }

//组件加载
onLoad(() => {
  // reasons.value = [
  //   { Name: '不带出' },
  //   { Name: '不带出' },
  //   { Name: '不带出' },
  //   { Name: '不带出' },
  //   { Name: '不带出' },
  //   { Name: '不带出' }
  // ]
  //获取不带出理由列表
  // await getReasonsList()
})

// 不带出 确认按钮
const handleConfirm = () => {
  uni.showToast({
    title: '确认',
    icon: 'none',
    duration: 2000
  })
  // 非其他理由
  emits('confirm')
}
// 不带出 取消按钮
const handleCancel = () => {
  uni.showToast({
    title: '取消',
    icon: 'none',
    duration: 2000
  })
  emits('cancel')
}
</script>

<style scoped lang="scss">
.Info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(31, 31, 31, 0.6);
  z-index: 5; /* 确保这是页面上最高的z-index */
  .modal {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    // height: 329.5898rpx /* 450px -> 329.5898rpx */;
    width: 80%;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    overflow: auto;
    .modal-header {
      height: 32.959rpx /* 45px -> 32.959rpx */;
      line-height: 32.959rpx /* 45px -> 32.959rpx */;
      // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
      color: #000000;
      font-weight: 500;
      background-color: #f2f2f2;
      text-align: center;
    }
    .modal-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3.6621rpx /* 5px -> 3.6621rpx */ 21.9727rpx /* 30px -> 21.9727rpx */;
      overflow: hidden;
      .modal-content-info {
        margin-right: 7.3242rpx /* 10px -> 7.3242rpx */;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: flex-start;
        padding-right: 32.959rpx /* 45px -> 32.959rpx */;
        .tips {
          display: flex;
          align-items: center;
          height: 14.6484rpx /* 20px -> 14.6484rpx */;
          font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
          color: #b8b8b8;
        }
        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10.9863rpx /* 15px -> 10.9863rpx */ 0;
          .date {
            display: flex;
            align-items: center;
            justify-content: center;
            // width: 146.4844rpx /* 200px -> 146.4844rpx */;
            max-height: 100%;
            width: 183.1055rpx /* 250px -> 183.1055rpx */;
            // margin-right: 3.6621rpx /* 5px -> 3.6621rpx */;
            box-sizing: border-box;
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
                width: 87.8906rpx /* 120px -> 87.8906rpx */;
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
          .team-select {
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            display: flex;
            padding: 0 0 0 2.9297rpx /* 4px -> 2.9297rpx */;
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
                max-height: 62.2559rpx /* 85px -> 62.2559rpx */;
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
          .student-sex,
          .student-team {
            ::v-deep {
              //下拉最大高度
              .uni-select__selector-scroll {
                background-color: #fff;
                max-height: 131.8359rpx /* 180px -> 131.8359rpx */;
              }
            }
          }
          .student-state,
          .team-state {
            ::v-deep {
              //下拉最大高度
              .uni-select__selector-scroll {
                background-color: #fff;
                max-height: 91.5527rpx /* 125px -> 91.5527rpx */;
              }
            }
          }
          .student-level {
            ::v-deep {
              //下拉最大高度
              .uni-select__selector-scroll {
                background-color: #fff;
                max-height: 48.3398rpx /* 66px -> 48.3398rpx */;
              }
            }
          }
          .inp {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 183.1055rpx /* 250px -> 183.1055rpx */;
            max-height: 100%;
            text {
              color: #000;
              font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
            }
            ::v-deep {
              .uni-input-input:disabled {
                color: #686868;
              }
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
          .student-address {
            width: 100%;
          }
        }
      }
      .modal-content-img {
        width: 109.8633rpx /* 150px -> 109.8633rpx */;
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        // align-items: flex-end;
        .img {
          margin-top: 4.3945rpx /* 6px -> 4.3945rpx */;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          // align-items: flex-end;
          align-items: center;
          // flex-direction: column;
          text {
            font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
          }
          image {
            width: 109.8633rpx /* 150px -> 109.8633rpx */;
            height: 109.8633rpx /* 150px -> 109.8633rpx */;
          }
        }
      }
    }
    .modal-footer {
      background-color: #f2f2f2;
      // margin-top: 3.6621rpx /* 5px -> 3.6621rpx */;
      height: 43.9453rpx /* 60px -> 43.9453rpx */;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      // justify-content: space-around;
      // gap: 7.3242rpx /* 10px -> 7.3242rpx */;
      .btn {
        // flex-grow: 1;
        width: 65.918rpx /* 90px -> 65.918rpx */;
        height: 29.2969rpx /* 40px -> 29.2969rpx */;
        line-height: 29.2969rpx /* 40px -> 29.2969rpx */;
        // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        text-align: center;
        color: #333;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        background-color: #e0e0e0;
        // border-left: 0.7324rpx /* 1px -> .7324rpx */ solid #e7e7e7;
      }
      .btn.confirm {
        color: #fff;
        background-color: #00aaff;
      }
    }
  }
}
</style>
