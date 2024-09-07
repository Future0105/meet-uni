<!-- CustomModal.vue -->
<template>
  <view class="Info">
    <view class="modal" @click.stop>
      <view class="modal-header">民警信息</view>
      <view class="modal-content">
        <view class="modal-content-info">
          <view class="tips"> <text style="color: red">*</text>星号内容不可修改</view>
          <view class="student info">
            <view class="student-name inp">
              <text style="color: red">*</text>
              <text>民警姓名：</text>
              <uni-easyinput v-model="teacherName" disabled placeholder="民警姓名"></uni-easyinput>
            </view>
            <view class="student-id inp">
              <text style="color: red">*</text>
              <text>民警警号：</text>
              <uni-easyinput v-model="teachertId" disabled placeholder="民警警号"></uni-easyinput>
            </view>
          </view>
          <view class="student info">
            <view class="student-name inp">
              <text style="color: transparent">*</text>
              <text>重名标识：</text>
              <uni-easyinput v-model="teachertOnly" placeholder="请输入重名标识"></uni-easyinput>
            </view>
            <view class="student-id inp">
              <text style="color: transparent">*</text>
              <text>联系电话：</text>
              <uni-easyinput maxlength="11" v-model="teacherPhone" placeholder="请输入联系电话"></uni-easyinput>
            </view>
          </view>
          <view class="sex info">
            <view class="student-sex team-select">
              <text style="color: transparent">*</text>
              <text>民警性别：</text>
              <uni-data-select
                placeholder="请选择性别"
                :clear="true"
                emptyTips="暂无数据"
                v-model="teacherSex"
                :localdata="teacherSexList"
                @change="changeTeacherSex"
              ></uni-data-select>
            </view>
            <view class="team-select">
              <text style="color: red">*</text>
              <text>所在大队：</text>
              <uni-data-select
                placeholder="请选择部门"
                :clear="true"
                emptyTips="暂无数据"
                v-model="selectTeam"
                :localdata="teamsList"
                @change="changeTeam"
              ></uni-data-select>
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
const teacherName = ref('张三')
const teachertId = ref('500222190010101234')
const teachertOnly = ref('')
const teacherPhone = ref('')
const teacherSex = ref('')
const teacherSexList = ref([
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

//返回确认和取消操作给父级
const emits = defineEmits(['confirm', 'cancel'])
//性别
const changeTeacherSex = e => {
  teacherSex.value = e
  console.log(teacherSex.value)
}
//部门
const changeTeam = async e => {
  selectTeam.value = e // e 为选中的部门id
  console.log(selectTeam.value)
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
      align-items: flex-start;
      justify-content: space-between;
      padding: 3.6621rpx /* 5px -> 3.6621rpx */ 21.9727rpx /* 30px -> 21.9727rpx */;
      .modal-content-info {
        margin-right: 7.3242rpx /* 10px -> 7.3242rpx */;
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
          padding: 16.1133rpx /* 22px -> 16.1133rpx */ 0;
          .team-select {
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            display: flex;
            align-items: center;
            font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
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
                max-height: 80.5664rpx /* 110px -> 80.5664rpx */;
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
