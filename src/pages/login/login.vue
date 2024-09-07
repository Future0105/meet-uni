<template>
  <view class="container">
    <view class="layout">
      <!-- 顶部,左上Logo -->
      <view class="header">
        <image @click="logoClick" class="logo-img" src="@/static/image/logo/bigpic.png" mode="widthFix" />
      </view>
      <!-- 点击6次logo,设置IP弹窗 -->
      <uni-popup ref="popup" :mask-click="false" type="center">
        <view class="popup-content">
          <view class="popup-title">IP地址设置</view>
          <view class="popup-input">
            <uni-easyinput v-model="newBaseUrl" placeholder="请输入IP地址" />
          </view>
          <view class="popup-btn">
            <button class="btn-cancel" @click="handleCancel">取消</button>
            <button class="btn-confirm" @click="handleConfirm">确认</button>
          </view>
        </view>
      </uni-popup>
      <!-- 主体 -->
      <view class="main" :class="{ isInp: isFocusInp }">
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
                  <uni-easyinput
                    @focus="focusInp"
                    @blur="blurInp"
                    v-model="formData.UserName"
                    placeholder="请输入登录账号"
                  />
                </uni-forms-item>
                <uni-forms-item label="密码" name="Password">
                  <uni-easyinput
                    @focus="focusInp"
                    @blur="blurInp"
                    v-model="formData.Password"
                    placeholder="请输入登录密码"
                    type="password"
                  />
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
import { setBaseUrl } from '@/utils/request.js' // 导入设置IP setBaseUrl 函数
import { ref } from 'vue'
const loginStore = userLoginStore()
//登录表单数据
const formData = ref({
  UserName: '', //账号
  Password: '' //密码
})
//输入框聚焦,页面上移做到键盘输入不遮挡
const isFocusInp = ref(false)
const focusInp = () => {
  isFocusInp.value = true
}
//输入框失焦,页面恢复
const blurInp = () => {
  isFocusInp.value = false
}
//点击logo计数
const clickCount = ref(0)
//获取弹出框实例
const popup = ref(null)
//输入设置Ip
const newBaseUrl = ref('')
//logo点击事件
const logoClick = () => {
  clickCount.value++
  if (clickCount.value === 6) {
    // 当点击次数达到六次时，显示弹窗
    showPopup()
    // 重置计数器
    clickCount.value = 0
  }
}
//显示ip设置弹窗
const showPopup = () => {
  popup.value.open()
}
//取消,隐藏ip设置弹窗
const handleCancel = () => {
  popup.value.close()
  newBaseUrl.value = ''
}
// 确定,设置Ip
const handleConfirm = () => {
  if (newBaseUrl.value) {
    setIP()
    // 关闭弹窗
    handleCancel()
    uni.showToast({
      title: '设置IP地址成功',
      icon: 'none',
      duration: 1000
    })
  } else {
    uni.showToast({
      title: '请输入有效的IP地址',
      icon: 'none',
      duration: 2000
    })
  }
}
//将输入IP值传递android,等待校验
const setIP = () => {
  if (uni.getSystemInfoSync().platform === 'android') {
    window.android.H5ToAndroid(
      JSON.stringify({
        type: 'UPDATA_URL',
        url: newBaseUrl.value
      })
    )
  }
  //等待返回是否正确
  // 假设 newBaseUrl.value 是新的基地址，调用 setBaseUrl 更新并保存到本地存储
  // setBaseUrl(newBaseUrl.value)
}
//安卓返回校验
// const getBaseUrl = () => {
//   if (uni.getSystemInfoSync().platform === 'android') {
//     window.android.H5ToAndroid('FACE_COLLECT')
//   }
// }

//表单组件验证规则(用户名,密码)
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
      // console.log('表单校验失败', error)
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
            margin-top: 5px;
            ::v-deep {
              .uni-forms-item__label {
                color: #fff;
                font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
              }
            }
            .from-login-button {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 14.6484rpx /* 20px -> 14.6484rpx */;
              width: 100%;
              height: 25.6348rpx /* 35px -> 25.6348rpx */;
              .login-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 25.6348rpx /* 35px -> 25.6348rpx */;
                line-height: 25.6348rpx /* 35px -> 25.6348rpx */;
                border-radius: 12.4512rpx /* 17px -> 12.4512rpx */;
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
    .isInp {
      padding-bottom: 131.8359rpx /* 180px -> 131.8359rpx */;
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
.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 219.7266rpx /* 300px -> 219.7266rpx */;
  // height: 146.4844rpx /* 200px -> 146.4844rpx */;
  padding: 7.3242rpx /* 10px -> 7.3242rpx */ 14.6484rpx /* 20px -> 14.6484rpx */;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  .popup-title {
    font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
    height: 36.6211rpx /* 50px -> 36.6211rpx */;
    line-height: 36.6211rpx /* 50px -> 36.6211rpx */;
    color: #000000;
  }
  .popup-input {
    width: 190.4297rpx /* 260px -> 190.4297rpx */;
    ::v-deep {
      .uni-easyinput__placeholder-class {
        font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
        color: #8f8f8f;
      }
      .uni-easyinput__content-input {
        height: 21.9727rpx /* 30px -> 21.9727rpx */;
        font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
        // border: 2px solid #aaaaaa;
      }
      .is-input-border {
        border: 2px solid #000000;
        border-color: #c0c4cc !important;
      }
      .is-focused {
        border-color: rgb(0, 94, 255) !important;
      }
      .uniui-clear {
        font-size: 14.6484rpx /* 20px -> 14.6484rpx */ !important;
      }
    }
  }
  .popup-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 43.9453rpx /* 60px -> 43.9453rpx */;
    button {
      width: 65.918rpx /* 90px -> 65.918rpx */;
      height: 25.6348rpx /* 35px -> 25.6348rpx */;
      line-height: 25.6348rpx /* 35px -> 25.6348rpx */;
    }
    .btn-cancel {
      color: #fff;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
      // background-color: #e9b940;
      background-color: #c0c4cc;
    }
    .btn-confirm {
      color: #fff;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
      background-color: #00aaff;
    }
  }
}
</style>
