<template>
  <view class="waitOut">
    <NotOut :showReason="showReason" :noOutName="studentsList[notIndex]" @confirm="onConfirm" @cancel="onCancel" />
    <view class="header">
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
      <view class="teachers-select">
        <text>带队民警：</text>
        <button @click="showSelectTeacher" class="teachers-select-button">
          {{ teacherName }}
        </button>
        <button @click="showSelectTeacher" class="select-button">
          {{ showBtnText }}
        </button>
        <view v-show="showBtn" class="teacher-list">
          <checkbox-group @change="selectTeachersList">
            <label class="checkbox" v-for="item in teachersList" :key="item.teacherId">
              <view>
                <checkbox :value="item.name" :checked="item.teacherId === loginTeacherId" />
              </view>
              <view> {{ item.name }}</view>
            </label>
          </checkbox-group>
        </view>
      </view>
      <view class="button-box">
        <button @click="takeOutSelectedStudents" class="button">带出已勾选人员</button>
      </view>
    </view>
    <view class="main">
      <view class="tips">
        <text>
          最多选择学员
          <text>5</text>
          个
        </text>
        <text
          >已选择学员
          <text>{{ selectedStudentsLength }}</text>
          个
        </text>
      </view>
      <view class="student-list">
        <uni-table
          ref="studentTable"
          border
          stripe
          type="selection"
          emptyText="暂无更多数据"
          @selection-change="selectStudentsList"
        >
          <uni-tr height="50">
            <uni-th width="60" align="center">学员姓名</uni-th>
            <uni-th width="130" align="center">申请会见家属</uni-th>
            <uni-th width="100" align="center">学员所在大队</uni-th>
            <uni-th width="100" align="center">学员家庭住址</uni-th>
            <uni-th width="150" align="center">审核操作</uni-th>
          </uni-tr>
          <uni-tr height="50" v-for="(item, index) in studentsList" :key="item.studentId">
            <uni-td align="center">{{ item.name }}</uni-td>
            <uni-td align="center">
              <text style="padding: 0 3.6621rpx" v-for="(family, index) in item.familyName" :key="index">
                {{ family }}
              </text>
            </uni-td>
            <uni-td align="center">{{ item.teamName }}</uni-td>
            <uni-td align="center">{{ item.address }}</uni-td>
            <uni-td>
              <view class="check-out">
                <button @click="waitOut(index)" class="wait-out" size="mini">暂不带出</button>
                <button @click="notOut(index)" class="not-out" size="mini">不带出</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
    <!-- 分页器 -->
    <!-- <view class="uni-pagination-box">
      <uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" />
    </view> -->
  </view>
</template>

<script setup>
import NotOut from './NotOut.vue'
import { getTeamData_API, pushTodayList_API } from '@/api/data'
import { userLoginStore } from '@/store/login.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref, nextTick, onUnmounted } from 'vue'

//队伍名称(当前队伍数据)
const teamName = ref(null)

//所有队伍列表
const teamList = ref([])

//下拉框选中队伍(默认为当前登录大队)
const loginTeamValue = ref(2)
//登录默认带队民警(公用为空)
const loginTeacherId = ref(2)
//默认民警
const teacherName = ref('无')
//是否使用默认带队民警(是否改变默认)
const changeTeacher = ref(false)
//当前队伍学员信息
const studentsList = ref([])
//民警列表数据
const teachersList = ref([])

//获取学员表格元素
const studentTable = ref(null)
//今日带出记录
const todayList = ref([])

// 选择的学员列表   选中学员数量
const selectedStudents = ref([])
const selectedStudentsLength = ref(0)
// 当前选择的民警  选中民警数量
const selectedTeachers = ref([])
const selectedTeachersLength = ref(null)

// 隐藏不带出理由弹窗
const showReason = ref(false)
//不带出学员的索引
const notIndex = ref(null)
const showBtn = ref(false)
const showBtnText = ref('选择')

// 定义获取数据的方法
const getData = () => {
  studentsList.value = [
    {
      studentId: 1001,
      name: '大毛',
      familyName: ['大毛父亲'],
      teamName: '三大队',
      address: '北京'
    },
    {
      studentId: 1002,
      name: '二毛',
      familyName: ['二毛父亲', '二毛母亲'],
      teamName: '三大队',
      address: '上海'
    },
    {
      studentId: 1003,
      name: '熊大',
      familyName: ['熊大父亲', '熊大母亲', '熊大儿子'],
      teamName: '三大队',
      address: '广州'
    },
    {
      studentId: 1004,
      name: '熊二',
      familyName: ['熊二父亲', '熊二母亲', '熊二儿子', '熊二女儿'],
      teamName: '三大队',
      address: '深圳'
    },
    {
      studentId: 1005,
      name: '张三',
      familyName: ['父亲'],
      teamName: '三大队',
      address: '重庆'
    },
    {
      studentId: 1006,
      name: '李四',
      familyName: ['父亲', '母亲'],
      teamName: '三大队',
      address: '四川'
    },
    {
      studentId: 1007,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1008,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1009,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1010,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1011,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1012,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    },
    {
      studentId: 1013,
      name: '王五',
      familyName: ['父亲', '母亲', '大舅哥'],
      teamName: '三大队',
      address: '台湾'
    }
  ]
  teamList.value = [
    { value: 0, text: '一大队' }, //text  大队名称
    { value: 1, text: '二大队' },
    { value: 2, text: '三大队' },
    { value: 3, text: '四大队' },
    { value: 100, text: '五大队' }
  ]
  teachersList.value = [
    { teacherId: 0, name: '谢民警' },
    { teacherId: 1, name: '张民警' },
    { teacherId: 2, name: '李民警' },
    { teacherId: 3, name: '王民警' },
    { teacherId: 4, name: '黄民警' },
    { teacherId: 5, name: '熊民警' },
    { teacherId: 6, name: '陈民警' },
    { teacherId: 7, name: '范民警' },
    { teacherId: 7, name: '龙民警' }
  ]
  console.log('待带出定时器执行中')
}
// 定义定时器变量
let timer = null
onLoad(() => {
  const loginStore = userLoginStore()
  //当前登录用户
  // loginTeacherId.value = loginStore.loginData.loginInfo.loginTeacherId
  //
  //获取所有队伍列表
  // teamList.value = loginStore.loginData.teamList
  // 当前登录队伍value默认选中
  // loginTeamValue.value = loginStore.loginData.loginInfo.loginTeamValue
  // 当前登录队伍名称
  // teamName.value = loginStore.loginData.loginInfo.loginTeamName
  //获取当前队伍对应信息
  // studentsList.value = await getTeamData_API(teamName.value)
  getData()
  if (loginTeacherId.value) {
    teacherName.value = teachersList.value.find(item => item.teacherId === loginTeacherId.value).name
  }
  // 设置定时器，每隔5秒请求一次数据
  timer = setInterval(getData, 3000)
})
const teamChange = e => {
  // e === teamList.value
  // 先查找与 e 匹配的项
  const foundItem = teamList.value.find(item => item.value === e)

  // 处理找到和未找到的情况
  if (foundItem) {
    // 如果找到了匹配的项，将其 text 属性赋值给 teamName.value
    teamName.value = foundItem.text
  }
  // else {
  //   // 如果没有找到匹配的项，可以设置一个默认值或者进行其他处理
  //   console.log('未找到匹配项')
  //   teamName.value = ''
  // }
  // teamName.value = teamList.value.find(item => item.value === e)?.text
  // await getTeamData_API(teamName.value)
}

const showSelectTeacher = () => {
  if (!showBtn.value) {
    showBtnText.value = '确定'
    showBtn.value = true
  } else {
    showBtnText.value = '选择'
    showBtn.value = false
  }
}

// 带出已勾选学员
const takeOutSelectedStudents = () => {
  if (selectedTeachersLength.value <= 0) {
    if (loginTeacherId.value && !changeTeacher.value) {
      // 先查找与 loginTeacherId.value 匹配的教师项
      const foundTeacher = teachersList.value.find(item => item.teacherId === loginTeacherId.value)

      // 如果找到了教师项，则将其 name 属性放入 selectedTeachers 数组中；如果没有找到，可以处理未找到的情况
      if (foundTeacher) {
        selectedTeachers.value = [foundTeacher.name]
      }
      // else {
      //   // 如果未找到匹配的教师项，可以设置为空数组或进行其他处理
      //   selectedTeachers.value = []
      // }
      // selectedTeachers.value = [teachersList.value.find(item => item.teacherId === loginTeacherId.value)?.name]
    } else {
      uni.showToast({
        title: '请先选择民警',
        icon: 'none'
      })
      return
    }
    // alert('请先选择民警')
  }
  if (selectedStudentsLength.value <= 0) {
    uni.showToast({
      title: '请先选择学员',
      icon: 'none'
    })
    return
  }
  // 获取已选择学员的姓名列表
  const studentNames = selectedStudents.value.map(student => student.name).join('  ')
  // 弹出确认对话框
  uni.showModal({
    title: '确认带出学员',
    content: `${studentNames}`,
    success: async res => {
      if (res.confirm) {
        // console.log('用户点击确定')
        // 记录带出信息
        selectedStudents.value.forEach(student => {
          todayList.value = {
            name: student.name,
            familyName: student.familyName,
            teamName: student.teamName,
            address: student.address,
            status: '已带出',
            info: '无',
            teacherNames: selectedTeachers.value
          }
          console.log(todayList.value)
          // await pushTodayList_API(todayList.value)
        })
        selectedStudents.value.forEach(student => {
          const index = studentsList.value.findIndex(item => item.studentId === student.studentId)
          if (index !== -1) {
            studentsList.value.splice(index, 1)
          }
        })
        // 清空已选择的学员列表
        selectedStudents.value = []
        studentTable.value.clearSelection()
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    }
  })
}

// 选择民警 监听民警选择变化 并更新 selectedTeachers
const selectTeachersList = selections => {
  changeTeacher.value = true
  selectedTeachersLength.value = selections.detail.value.length // 选中民警数量
  if (selectedTeachersLength.value > 0) {
    selectedTeachers.value = selections.detail.value
    teacherName.value = selectedTeachers.value.join('，')
  } else {
    selectedTeachers.value = []
    teacherName.value = '无'
  }
}
//选择学员 监听学员选择变化 并更新 selectedStudents
const selectStudentsList = selections => {
  selectedStudentsLength.value = selections.detail.index.length // 选中学员数量
  // 限制最多选择5个学员
  if (selectedStudentsLength.value > 5) {
    uni.showToast({
      title: '一次最多选择5个学员',
      icon: 'none'
    })
    //使用 nextTick 确保 DOM 更新后清除选中的学员
    //用于在下次 DOM 更新循环结束之后执行延迟回调。
    nextTick(() => {
      studentTable.value.clearSelection()
    })
    return
  }
  if (selectedStudentsLength.value > 0) {
    console.log(selections.detail)
    selectedStudents.value = selections.detail.index.map(index => studentsList.value[index])
  } else {
    selectedStudents.value = []
  }
}
//暂不带出,移至列表末尾
const waitOut = index => {
  console.log(index)
  const waitOutStudent = studentsList.value.splice(index, 1)[0] // 移除选中的学员
  console.log(waitOutStudent)
  studentsList.value.push(waitOutStudent) // 将移除的学员添加到末尾
}

//不带出
const notOut = index => {
  if (selectedTeachersLength.value <= 0) {
    if (loginTeacherId.value && !changeTeacher.value) {
      //find 方法会查找数组中符合条件的第一个元素，并返回该元素。
      // 先查找与 loginTeacherId.value 匹配的教师项
      const foundTeacher = teachersList.value.find(item => item.teacherId === loginTeacherId.value)

      // 如果找到了教师项，则将其 name 属性放入 selectedTeachers 数组中；如果没有找到，可以处理未找到的情况
      if (foundTeacher) {
        selectedTeachers.value = [foundTeacher.name]
      }
      // else {
      //   // 如果未找到匹配的教师项，可以设置为空数组或进行其他处理
      //   selectedTeachers.value = []
      // }
      // selectedTeachers.value = [teachersList.value.find(item => item.teacherId === loginTeacherId.value)?.name]
      // selectedTeachers.value = [teachersList.value[nameValue.value].name]
    } else {
      uni.showToast({
        title: '执行不带出操作,请先选择民警',
        icon: 'none'
      })
      return
    }
  }
  showReason.value = true //不带出理由弹窗

  notIndex.value = index // 记录待带出学员的索引
}

//隐藏不带出理由弹窗
const hideReason = () => {
  showReason.value = false
}
const onConfirm = value => {
  //value 为不带出理由
  todayList.value = {
    name: studentsList.value[notIndex.value].name,
    familyName: studentsList.value[notIndex.value].familyName,
    teamName: studentsList.value[notIndex.value].teamName,
    address: studentsList.value[notIndex.value].address,
    status: '不带出',
    info: value,
    teacherNames: selectedTeachers.value
  }
  studentsList.value.splice(notIndex.value, 1) // 移除选中的学员
  console.log(todayList.value)
  hideReason()
  // await pushTodayList_API(todayList.value)
}
const onCancel = () => {
  hideReason()
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('待带出,定时器已清除')
  }
}
// 暴露方法让父组件可以调用
// defineExpose({
//   clearTimer
// })
// 在组件卸载时清除定时器
onUnmounted(clearTimer)
// onUnmounted(() => {
//   clearTimer()
// })
</script>

<style lang="scss" scoped>
.waitOut {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 12%;
    margin: 0 3%;
    padding: 0 2%;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    background-color: rgba(175, 174, 174, 0.3);
    // overflow: hidden;
    // backdrop-filter: blur(1.4648rpx /* 2px -> 1.4648rpx */); /* 添加模糊效果 */
    .team-select {
      width: 35%;
      max-height: 100%;
      padding: 0 0 0 3.6621rpx /* 5px -> 3.6621rpx */;
      background-color: #fff;
      border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      white-space: nowrap;
      // overflow: hidden;
      text-overflow: ellipsis;
    }
    .teachers-select {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40%;
      height: 36.6211rpx /* 50px -> 36.6211rpx */;
      max-width: 42%;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
      .teachers-select-button {
        position: relative;
        margin: 0;
        width: 50%; /* 500px -> 366.2109rpx */ /* 200px -> 146.4844rpx */
        max-height: 100%;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .select-button {
        // margin: 0;
        margin-left: 5.8594rpx /* 8px -> 5.8594rpx */;
        width: 20%;
        max-height: 100%;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .teacher-list {
        position: absolute;
        z-index: 10;
        top: 105%;
        left: 22%;
        background-color: #dbdfdf;
        width: 50%;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        max-height: 161.1328rpx /* 220px -> 161.1328rpx */;
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        overflow-y: auto; /* 添加垂直滚动条 */
        .checkbox {
          display: flex;
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          padding: 10.9863rpx /* 15px -> 10.9863rpx */;
        }
      }
    }
    .button-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 18%;
      height: 36.6211rpx /* 50px -> 36.6211rpx */;
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-height: 100%;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        color: #fff;
        background-color: rgba(72, 171, 232, 0.8); /* 设置背景色和透明度 */
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        // backdrop-filter: blur(1.4648rpx /* 2px -> 1.4648rpx */); /* 添加模糊效果 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .main {
    max-height: 88%;
    width: 100%;
    // max-height: 80%; /* 调整 main 容器的高度以确保有足够空间 */
    padding: 1% 3%;
    display: flex;
    flex-direction: column;

    // justify-content: space-between;
    .tips {
      padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
    }
    .student-list {
      width: 100%;
      height: 100%;
      // max-height: 100%; /* 确保 student-list 充满 main 容器 */
      border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow-y: auto; /* 添加垂直滚动条 */
      // overflow: hidden;
      .check-out {
        display: flex;
        align-items: center;
        justify-content: center;
        .wait-out {
          background-color: rgb(253, 218, 101);
        }
        .not-out {
          background-color: #f82522;
        }
      }
    }
  }
}
</style>
