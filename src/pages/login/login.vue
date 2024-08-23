<template>
  <view class="container">
    <view class="layout">
      <!-- 顶部,左上Logo -->
      <view class="header">
        <image class="logo-img" src="@/static/image/logo/bigpic.png" mode="widthFix" />
      </view>
      <!-- 主体 -->
      <view class="main">
        <!-- 主体左部,img -->
        <view class="layout-left">
          <image class="left-bgimg" src="@/static/image/slices/loginImgS.png" mode="widthFix" />
        </view>
        <!-- 主体右部,form -->
        <view class="layout-right">
          <view class="form-box">
            <view class="form-title">
              <text>智慧探访系统</text>
              <text>版本 V2.1</text>
            </view>
            <view class="form-body">
              <!-- 表单组件 -->
              <uni-forms :model="formData" ref="form" :rules="rules" label-position="top">
                <uni-forms-item label="账号" name="UserName">
                  <uni-easyinput v-model="formData.UserName" placeholder="请输入登录账号" />
                </uni-forms-item>
                <uni-forms-item label="密码" name="Password">
                  <uni-easyinput v-model="formData.Password" placeholder="请输入登录密码" type="password" />
                </uni-forms-item>
                <view class="from-login-button">
                  <button class="login-btn" @click="submitForm">登 录</button>
                </view>
              </uni-forms>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部,声明 -->
      <view class="footer">
        <text>技术支持：重庆云祥晟科技有限公司</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { userLoginStore } from '@/store/login.js'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
const loginStore = userLoginStore()
//登录表单数据
const formData = ref({
  UserName: '', //账号
  Password: '' //密码
})
onLoad(async () => {
  loginStore.getTeamsList()
  loginStore.getTeachersList()
})
//表单组件验证规则
const rules = {
  UserName: {
    rules: [
      { required: true, errorMessage: '账号不能为空' }, //必须存在数据
      { pattern: /^[a-zA-Z0-9]{3,16}$/, errorMessage: '账号只能包含字母和数字，长度在3到16个字符之间' }
    ]
  },
  Password: {
    rules: [
      { required: true, errorMessage: '密码不能为空' }, //必须存在数据
      {
        pattern: /^[a-zA-Z0-9@#$%^&*.]{6,16}$/,
        errorMessage: '密码长度应在6到16个字符之间，且只能包含字母、数字和特殊字符@#$%^&*.'
      }
    ]
  }
}
//获取整个表单元素
const form = ref(null)
//提交表单,验证成功-登录
const submitForm = () => {
  form.value
    .validate()
    .then(async valid => {
      //对象解构
      const { UserName, Password } = formData.value
      //表单规则校验成功,发起登录请求
      await loginStore.login({ UserName, Password })
    })
    .catch(error => {
      ////校验失败
      console.log('表单校验失败', error)
    })
}
// @blur 验证单个字段
// const validateField = fieldName => {
//   form.value.validateField(fieldName).catch(error => {
//     console.log(fieldName, '表单校验失败')
//   })
// }
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
    /* 背景颜色、图片、定位和尺寸 */
    background-image: url('@/static/image/slices/loginBgS.png');
    //contain按比例缩放,可能不会覆盖整个背景区域
    //cover按比例缩放以完全覆盖背景区域，可能会裁剪掉部分图像
    background-size: 100% 100%; /* 图像会拉伸以适应背景区域的大小 */
    background-position: center; /* 可选：将背景图像居中 */
    .header {
      flex: 4;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      .logo-img {
        width: 256.3477rpx /* 350px -> 256.3477rpx */;
        margin-left: 36.6211rpx /* 50px -> 36.6211rpx */;
      }
    }
    .main {
      flex: 14;
      display: flex;
      .layout-left {
        flex: 1;
        // background-color: #108b89;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .left-bgimg {
          width: 205.0781rpx /* 280px -> 205.0781rpx */;
        }
      }
      .layout-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: #fff;
        .form-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // justify-content: center;
          width: 205.0781rpx /* 280px -> 205.0781rpx */;
          // height: 300.293rpx /* 410px -> 300.293rpx */;
          padding: 14.6484rpx /* 20px -> 14.6484rpx */;
          // background-color: #fff;
          // background-color: rgb(192, 134, 134);
          .form-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 21.9727rpx /* 30px -> 21.9727rpx */;
            padding: 7.3242rpx /* 10px -> 7.3242rpx */;
            text:nth-child(2) {
              font-weight: 500;
              font-size: 11.7188rpx /* 16px -> 11.7188rpx */; // 改变字体大小
            }
          }
          .form-body {
            width: 100%;
            margin-top: 15px;
            ::v-deep {
              .uni-forms-item__label {
                color: #fff;
                font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
              }
            }
            .from-login-button {
              margin-top: 21.9727rpx /* 30px -> 21.9727rpx */;
              width: 100%;
              height: 21.9727rpx /* 30px -> 21.9727rpx */;
              .login-btn {
                width: 100%;
                height: 21.9727rpx /* 30px -> 21.9727rpx */;
                line-height: 21.9727rpx /* 30px -> 21.9727rpx */;
                border-radius: 10.9863rpx /* 15px -> 10.9863rpx */;
                color: #fff;
                font-weight: 700;
                font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
                background-color: #007aff;
              }
            }
          }
        }
      }
    }
    .footer {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10.9863rpx /* 15px -> 10.9863rpx */;
      color: #fff;
    }
  }
}
</style>
