<template>
  <view class="waitOut">
    <!-- 不带出理由弹窗 -->
    <NotOut v-if="showReason" @confirm="onConfirm" @cancel="onCancel" />
    <view class="header">
      <!-- 部门选择下拉框 -->
      <view class="team-box">
        <view class="team-select">
          <uni-data-select
            label="所在大队"
            placeholder="所有部门"
            emptyTips="暂无数据"
            v-model="selectTeam"
            :clear="true"
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
      <!-- 民警选择 -->
      <view class="teachers-select" @click="handleWrapperClick">
        <text>带队民警：</text>
        <button @click.stop="showSelectTeacher" class="teachers-select-button">
          {{ selectedTeachers }}
        </button>
        <button @click.stop="showSelectTeacher" class="select-button">
          <uni-icons :type="showBtn ? 'up' : 'down'" color="#c2c2c2" size="35"></uni-icons>
          <text>{{ showBtn ? '确认选择' : '选择民警' }}</text>
        </button>
        <view v-show="showBtn" class="teacher-list">
          <checkbox-group class="checkbox-group" v-if="teachersList" @change="selectTeachersList">
            <label class="checkbox" v-for="item in teachersList" :key="item.Id">
              <view>
                <checkbox :value="JSON.stringify(item)" :checked="item.Id === selectedTeacherId" />
              </view>
              <view> {{ item.Name }}{{ item.RemarkName ? `(${item.RemarkName})` : '' }}</view>
            </label>
          </checkbox-group>
          <view v-else class="checkbox-group-none">暂无数据</view>
        </view>
      </view>
      <!-- 带出已勾选学员 -->
      <button class="tack-btn" @click="takeOutSelectedStudents">
        <uni-icons type="paperplane" color="#fff" size="35"></uni-icons><text>带出已勾选学员</text>
      </button>
    </view>
    <view class="main">
      <!-- 带出限制提示 -->
      <view class="tips">
        <text>
          最多选择学员
          <text>20</text>
          个，
        </text>
        <text
          >已选择学员
          <text>{{ selectedStudentsLength }}</text>
          个
        </text>
      </view>
      <!-- 带出学员列表 -->
      <view class="student-list">
        <uni-table
          ref="studentTable"
          :border="true"
          type="selection"
          emptyText="暂无更多数据"
          @selection-change="selectStudentsList"
        >
          <uni-tr>
            <uni-th width="160" align="center">学员姓名</uni-th>
            <uni-th width="250" align="center">申请会见家属</uni-th>
            <uni-th width="280" align="center">学员所在大队</uni-th>
            <uni-th width="400" align="center">学员家庭住址</uni-th>
            <uni-th width="230" align="center">审核操作</uni-th>
          </uni-tr>
          <uni-tr style="" v-for="student in studentsList" :key="student.Id">
            <uni-td align="center"> {{ student.CadetName }}</uni-td>
            <uni-td align="center">{{ student.KinName }}</uni-td>
            <uni-td align="center">{{ student.CollegeName }}</uni-td>
            <uni-td align="center">{{ student.DepartPath }}</uni-td>
            <uni-td>
              <!-- 操作 -->
              <view class="check-out">
                <button @click="waitOut(student.Id)" class="wait-out" size="mini">暂不带出</button>
                <button @click="notOut(student.Id)" class="not-out" size="mini">不带出</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script setup>
import NotOut from './NotOut.vue'
import {
  getStudentsList_API,
  upDataStudentsList_API,
  getTeachersList_API,
  pushNotOut_API,
  pushWaitOut_API,
  pushTackOut_API
} from '@/api/data'
import { userLoginStore } from '@/store/login.js'
import { onLoad } from '@dcloudio/uni-app'
import { ref, nextTick, onUnmounted } from 'vue'
const loginStore = userLoginStore()
//所有队伍列表
const teamsList = ref([])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(0)

//民警列表数据
const teachersList = ref([])
//符合登录信息,教员列表id匹配默认选中
const selectedTeacherId = ref('')
//选中的民警
const selectedTeachers = ref('请选择民警')
const tackoutTeachersIds = ref([])
//选中民警数量
const selectedTeachersLength = ref(0)

//当前队伍学员信息
const studentsList = ref([])
const upDataStudents = ref([])
// 选择的学员列表   选中学员数量
const selectedStudents = ref([])
const selectedStudentsLength = ref(0)

//不带出理由弹窗
const showReason = ref(false)
//不带出学员的索引
const notStudentId = ref(null)
//选择民警按钮显示状态
const showBtn = ref(false)
//获取学员表格元素,用于清空选中状态
const studentTable = ref(null)
//获取待带出学员数据
const getStudentsList = async (data = {}) => {
  const studentsListRes = await getStudentsList_API(data)
  if (studentsListRes.code === 200) {
    if (studentsListRes.data) {
      studentsList.value = studentsListRes.data
    }
    // console.log(studentsList.value)
  } else {
    uni.showToast({
      title: '获取待带出学员列表失败',
      icon: 'none'
    })
  }
}

//获取推送更新学员数据
const upDataStudentsList = async (data = {}) => {
  const upDataStudentsListRes = await upDataStudentsList_API(data)
  if (upDataStudentsListRes.code === 200) {
    if (upDataStudentsListRes.data) {
      upDataStudents.value = upDataStudentsListRes.data
    }
  } else {
    uni.showToast({
      title: '推送更新学员列表失败',
      icon: 'none'
    })
  }
}
const upDataStudentsAdd = async () => {
  await upDataStudentsList()
  studentsList.value.push(...upDataStudents.value)
}
//获取教员列表
const getTeachersList = async (data = {}) => {
  const teachersListRes = await getTeachersList_API(data)
  if (teachersListRes.code === 200) {
    teachersList.value = teachersListRes.data
    if (teachersList.value) {
      if (teachersList.value.find(item => item.Id === loginStore.loginInfo.Id)) {
        //用于列表渲染时匹配默认选中
        selectedTeacherId.value = teachersList.value.find(item => item.Id === loginStore.loginInfo.Id).Id
        //选中民警姓名
        selectedTeachers.value = teachersList.value.find(item => item.Id === loginStore.loginInfo.Id).Name
        //选中民警数量
        selectedTeachersLength.value = 1
      }
    }
  } else {
    uni.showToast({
      title: '获取民警列表失败',
      icon: 'none'
    })
  }
  // console.log(teachersList.value);
}

let timer = null
onLoad(async () => {
  // 部门列表
  teamsList.value = loginStore.teamsList
  //根据登录信息,匹配默认选中部门
  if (teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId)) {
    selectTeam.value = teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId).value
  }
  //所有学员
  await getStudentsList()
  //教员信息
  await getTeachersList({ CollegeId: selectTeam.value })
  // // 设置定时器，每隔60秒请求一次数据
  timer = setInterval(upDataStudentsAdd, 30000)
})
//下拉框更改部门
const teamListChange = async e => {
  if (e) {
    selectTeam.value = e // e 为选中的部门id
  } else {
    selectTeam.value = 0 // 0 所有部门
  }
}
//查询和刷新,学员数据
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
  //     CadetName: '张三',
  //     KinName: '张父亲,张母亲',
  //     CollegeName: '教育矫治所',
  //     DepartPath: '重庆市重庆区重庆街道'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '李四',
  //     KinName: '李四姐,李四兄',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '王五',
  //     KinName: '王五弟',
  //     CollegeName: '二大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '重庆市重庆区教育矫治所',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '二毛',
  //     KinName: '二毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所教育矫治教育矫治教育矫治教育矫治'
  //   },
  //   {
  //     Id: 1006,
  //     CadetName: '三毛',
  //     KinName: '三毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1007,
  //     CadetName: '四毛',
  //     KinName: '四毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1008,
  //     CadetName: '五毛',
  //     KinName: '五毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1009,
  //     CadetName: '六毛',
  //     KinName: '六毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1010,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1011,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1012,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1013,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1014,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1015,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1016,
  //     CadetName: '选择民警选择民警选择民警选择民警',
  //     KinName: '选择民警选择民警选择民警选择民警',
  //     CollegeName: '三大队',
  //     DepartPath: '大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲'
  //   },
  //   {
  //     Id: 1017,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1018,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1019,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1020,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1021,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1022,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1023,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   }
  // ]
  // teachersList.value = [
  //   { Id: 4350, Name: '张警官' },
  //   { Id: 4351, Name: '王警官' },
  //   { Id: 4352, Name: '李警告' },
  //   { Id: 4353, Name: '李莉' },
  //   { Id: 4354, Name: '欧阳昊天' },
  //   { Id: 4355, Name: '李涛' },
  //   { Id: 4356, Name: '罗凯' },
  //   { Id: 4357, Name: '李涛' },
  //   { Id: 4358, Name: '李莉' },
  //   { Id: 4359, Name: '罗凯' },
  //   { Id: 4360, Name: '李涛' }
  // ]
  selectedTeachersLength.value = 0
  tackoutTeachersIds.value = []
  selectedTeachers.value = '请选择民警'
  studentTable.value.clearSelection()
  //clearSelection等于以下清空且会清空多选框选中
  // selectedStudents.value = []
  // selectedStudentsLength.value = 0
  // 学员列表
  await getStudentsList()
  //民警列表
  await getTeachersList({ CollegeId: selectTeam.value })
  // studentsList.value = [
  //   {
  //     Id: 1001,
  //     CadetName: '张三',
  //     KinName: '张父亲,张母亲',
  //     CollegeName: '教育矫治所',
  //     DepartPath: '重庆市重庆区重庆街道'
  //   },
  //   {
  //     Id: 1002,
  //     CadetName: '李四',
  //     KinName: '李四姐,李四兄',
  //     CollegeName: '一大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1003,
  //     CadetName: '王五',
  //     KinName: '王五弟',
  //     CollegeName: '二大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1004,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '重庆市重庆区教育矫治所',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所'
  //   },
  //   {
  //     Id: 1005,
  //     CadetName: '二毛',
  //     KinName: '二毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区重庆街道教育矫治所教育矫治教育矫治教育矫治教育矫治'
  //   },
  //   {
  //     Id: 1006,
  //     CadetName: '三毛',
  //     KinName: '三毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1007,
  //     CadetName: '四毛',
  //     KinName: '四毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1008,
  //     CadetName: '五毛',
  //     KinName: '五毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1009,
  //     CadetName: '六毛',
  //     KinName: '六毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1010,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: '重庆市重庆区'
  //   },
  //   {
  //     Id: 1011,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1012,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1013,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1014,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1015,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1016,
  //     CadetName: '选择民警选择民警选择民警选择民警',
  //     KinName: '选择民警选择民警选择民警选择民警',
  //     CollegeName: '三大队',
  //     DepartPath: '大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲'
  //   },
  //   {
  //     Id: 1017,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1018,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1019,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1020,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1021,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1022,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   },
  //   {
  //     Id: 1023,
  //     CadetName: '大毛',
  //     KinName: '大毛父亲',
  //     CollegeName: '三大队',
  //     DepartPath: 'DepartPath'
  //   }
  // ]
}
//选择教员列表按钮
const showSelectTeacher = () => {
  showBtn.value = !showBtn.value
  if (showBtn.value) {
    //选择教员列表开启状态,添加点击事件
    document.addEventListener('click', handleDocumentClick)
  }
}
//会检查点击是否在列表区域外，如果是，它会隐藏列表
const handleDocumentClick = event => {
  //如果不再区域内关闭选择框并移除文档上的点击事件监听器
  //closest 点击的元素（event.target）或者该元素的父级元素都不是带有 teachers-select 类的元素，
  //也就是点击区域不在.teachers - select 元素内
  if (!event.target.closest('.teachers-select')) {
    showBtn.value = false
    document.removeEventListener('click', handleDocumentClick)
  }
}
//确保在点击选择框内部时不会误触发关闭逻辑,阻止点击事件向上传递（冒泡），
// 从而防止触发全局的handleDocumentClick
const handleWrapperClick = event => {
  event.stopPropagation()
}
// 带出已勾选学员
const takeOutSelectedStudents = async () => {
  if (selectedTeachersLength.value <= 0) {
    uni.showToast({
      title: '请选择带队民警',
      icon: 'none'
    })
    return
  }
  if (selectedStudentsLength.value <= 0) {
    uni.showToast({
      title: '请选择带出学员',
      icon: 'none'
    })
    return
  }
  // console.log(selectedStudents.value.join(','), '学员/分割/民警', tackoutTeachersIds.value.join(','))
  await pushTackOut_API({
    Ids: selectedStudents.value.join(','),
    PolicemanIds: tackoutTeachersIds.value.join(',')
  })
  // 清空已选择的学员列表,数量
  studentTable.value.clearSelection()
  //clearSelection等于以下清空且会清空多选框选中
  // selectedStudents.value = []
  // selectedStudentsLength.value = 0
  await getStudentsList()
  uni.showToast({
    title: '带出学员成功',
    icon: 'none'
  })
  // 获取已选择学员的姓名列表
  // const studentNames = selectedStudents.value.map(student => student.CadetName).join('  ')
  // 弹出确认对话框
  // uni.showModal({
  //   title: '确认带出已勾选学员',
  //   // content: `${studentNames}`,
  //   success: async res => {
  //     if (res.confirm) {
  //       // console.log('用户点击确定')
  //       // 记录带出信息
  //       // selectedStudents.value.forEach(student => {
  //       //   todayList.value = {
  //       //     name: student.name,
  //       //     familyName: student.familyName,
  //       //     teamName: student.teamName,
  //       //     address: student.address,
  //       //     status: '已带出',
  //       //     info: '无',
  //       //     teacherNames: selectedTeachers.value
  //       //   }
  //       //   console.log(todayList.value)
  //       //   // await pushTodayList_API(todayList.value)
  //       // })
  //       // selectedStudents.value.forEach(student => {
  //       //   const index = studentsList.value.findIndex(item => item.Id === student.Id)
  //       //   if (index !== -1) {
  //       //     studentsList.value.splice(index, 1)
  //       //   }
  //       // })
  //       console.log(selectedStudents.value.map(student => student.Id).join(','), tackoutTeachersIds.value.join(','))
  //       await pushTackOut_API({
  //         Ids: selectedStudents.value.map(student => student.Id).join(','),
  //         PolicemanIds: tackoutTeachersIds.value.join(',')
  //       })
  //       // 清空已选择的学员列表
  //       selectedStudents.value = []
  //       // studentTable.value.clearSelection()
  //       // await selectStudents()
  //       await getStudentsList({ CollegeId: selectTeam.value })
  //     } else if (res.cancel) {
  //       // console.log('用户点击取消')
  //     }
  //   }
  // })
}
// 选择民警 监听民警选择变化 并更新 selectedTeachers
const selectTeachersList = selections => {
  const selectTeacher = selections.detail.value.map(item => JSON.parse(item))
  selectedTeachersLength.value = selectTeacher.length // 选中民警数量
  if (selectedTeachersLength.value > 0) {
    // 从传递的对象中获取 Id 和 Name
    tackoutTeachersIds.value = selectTeacher.map(teacher => teacher.Id)
    selectedTeachers.value = selectTeacher
      .map(teacher => {
        return teacher.Name + (teacher.RemarkName ? `(${teacher.RemarkName})` : '')
      }) // 获取已选中的民警名字
      .join(',')
  } else {
    tackoutTeachersIds.value = []
    selectedTeachers.value = '请选择民警'
  }
}
//选择学员 监听学员选择变化 并更新 selectedStudents
const selectStudentsList = selections => {
  selectedStudentsLength.value = selections.detail.index.length // 选中学员数量
  // 限制最多选择20个学员
  if (selectedStudentsLength.value > 20) {
    //使用 nextTick 确保 DOM 更新后清除选中的学员
    //用于在下次 DOM 更新循环结束之后执行延迟回调。
    nextTick(() => {
      studentTable.value.clearSelection()
      selections.detail.index.slice(0, 20).forEach(item => {
        studentTable.value.toggleRowSelection(item, true)
      })
      selectedStudents.value = selections.detail.index.slice(0, 20).map(index => studentsList.value[index].Id)
      uni.showToast({
        title: '一次最多选择20个学员',
        icon: 'none'
      })
    })
    return
  }
  if (selectedStudentsLength.value > 0) {
    selectedStudents.value = selections.detail.index.map(index => studentsList.value[index].Id)
  } else {
    selectedStudents.value = []
  }
}
//暂不带出,移至列表末尾
const waitOut = async Id => {
  await pushWaitOut_API(Id)
  await getStudentsList()
}
//不带出
const notOut = Id => {
  showReason.value = true //不带出理由弹窗
  notStudentId.value = Id // 记录待带出学员的索引
}
//隐藏不带出理由弹窗
const hideReason = () => {
  showReason.value = false
}
// 弹窗确认不带出
const onConfirm = async value => {
  //value 为不带出理由id
  await pushNotOut_API({
    Id: notStudentId.value,
    NoBringOutReasonId: value
  })
  await getStudentsList()
  hideReason()
}
//弹窗取消操作
const onCancel = () => {
  hideReason()
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    // console.log('1分钟更新推送学员列表,定时器已清除')
  }
}
// 在组件卸载（销毁）时执行 redirectTo卸载,navigateTo保留
onUnmounted(() => {
  clearTimer()
})
</script>

<style lang="scss" scoped>
.waitOut {
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
    // background-color: #c2c2c2;
    // overflow: hidden;
    // backdrop-filter: blur(1.4648rpx /* 2px -> 1.4648rpx */); /* 添加模糊效果 */
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
          .uni-select__input-placeholder {
            color: #999999;
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
    .teachers-select {
      position: relative;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      // width: 212.4023rpx /* 290px -> 212.4023rpx */;
      max-width: 241.6992rpx /* 330px -> 241.6992rpx */;
      // overflow: hidden;
      height: 100%;
      color: #000;
      font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
      font-weight: 400;
      // background-color: #fff;
      // border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      .teachers-select-button {
        // padding: 0 3.6621rpx /* 5px -> 3.6621rpx */;
        margin: 0;
        width: 95.2148rpx /* 130px -> 95.2148rpx */;
        height: 100%;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        color: #000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // border: .7324rpx /* 1px -> .7324rpx */ #d1d1d1 solid;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
        // border: 1px solid #e5e5e5;
        background-color: #e0e0e0;
      }
      .select-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // gap: 2px;
        padding-left: 2.1973rpx /* 3px -> 2.1973rpx */;
        // margin: 0 0 0 4.3945rpx /* 6px -> 4.3945rpx */;
        margin-left: 4.3945rpx /* 6px -> 4.3945rpx */;
        width: 73.2422rpx /* 100px -> 73.2422rpx */;
        // border: 1px solid #e5e5e5;
        // background-color: #ba6060;
        height: 100%;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
        background-color: #e0e0e0;
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
      .teacher-list {
        position: absolute;
        z-index: 10;
        top: 38.0859rpx /* 52px -> 38.0859rpx */;
        left: 62.2559rpx /* 85px -> 62.2559rpx */;
        .checkbox-group {
          display: flex;
          // flex-direction: column;
          flex-wrap: wrap;
          // align-items: center;
          align-content: flex-start;
          justify-content: space-around;
          // background-color: rgb(25, 76, 219);
          background-color: #c3c7c9;
          padding: 3.6621rpx /* 5px -> 3.6621rpx */;
          margin: 0;
          width: 164.7949rpx /* 225px -> 164.7949rpx */;
          max-height: 314.9414rpx /* 430px -> 314.9414rpx */;
          border-radius: 5px;
          overflow: auto; /* 添加垂直滚动条 */
          // scrollbar-width: thin; /* 适用于Firefox */
          // scrollbar-color: #c61212 #e0e0e0; /* 滚动条颜色，适用于Firefox */
          .checkbox {
            display: flex;
            font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
            font-weight: 400;
            width: 73.2422rpx /* 100px -> 73.2422rpx */;
            height: 20.5078rpx /* 28px -> 20.5078rpx */;
            line-height: 20.5078rpx /* 28px -> 20.5078rpx */;
            padding: 0 2.9297rpx /* 4px -> 2.9297rpx */;
            margin: 2.1973rpx /* 3px -> 2.1973rpx */ 0;
            background-color: #e9e9e9;
            border-radius: 5px;
          }
        }
        ::v-deep {
          .uni-label-pointer {
            font-size: 8.7891rpx /* 12px -> 8.7891rpx */ !important;
            :nth-child(2) {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .uni-checkbox-input {
            width: 11.7188rpx /* 16px -> 11.7188rpx */;
            height: 11.7188rpx /* 16px -> 11.7188rpx */;
            margin: 0 2.9297rpx /* 4px -> 2.9297rpx */ 0 0;
            // background-color: #ff5722;
            svg {
              width: 35px;
              height: 35px;
            }
          }
        }
        .checkbox-group-none {
          width: 172.1191rpx /* 235px -> 172.1191rpx */;
          padding: 5.8594rpx /* 8px -> 5.8594rpx */;
          background-color: #e0e0e0;
          border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
        }
      }
    }
    .tack-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin: 0;
      width: 109.8633rpx /* 150px -> 109.8633rpx */;
      height: 100%;
      border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
      color: #000000;
      background-color: #00aaff;
      color: #fff;
      border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      // backdrop-filter: blur(1.4648rpx /* 2px -> 1.4648rpx */); /* 添加模糊效果 */
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
  .main {
    flex: 1;
    width: 100%;
    // max-height: 80%; /* 调整 main 容器的高度以确保有足够空间 */
    padding: 0 3% 7.3242rpx /* 10px -> 7.3242rpx */;
    display: flex;
    flex-direction: column;
    overflow: auto;
    // justify-content: space-between;
    .tips {
      display: flex;
      align-items: center;
      color: #fff;
      // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      height: 21.9727rpx /* 30px -> 21.9727rpx */;
      font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
    }
    .student-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      // max-height: 100%; /* 确保 student-list 充满 main 容器 */
      // border: 0.7324rpx /* 1px -> .7324rpx */ #b8b5b5 solid;
      border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
      overflow: auto; /* 添加垂直滚动条 */
      // overflow: hidden;
      .check-out {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .wait-out {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          width: 43.9453rpx /* 60px -> 43.9453rpx */;
          height: 21.9727rpx /* 30px -> 21.9727rpx */;
          // background-color: rgb(253, 218, 101);
          font-size: 8.7891rpx /* 12px -> 8.7891rpx */;
          color: #ffb800;
          border: 1px #ffb800 solid;
          background-color: rgba(255, 211, 129, 0.2);
          white-space: nowrap;
          overflow: hidden;
          // text-overflow: ellipsis;
        }
        .not-out {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          width: 43.9453rpx /* 60px -> 43.9453rpx */;
          height: 21.9727rpx /* 30px -> 21.9727rpx */;
          // background-color: rgb(253, 218, 101);
          font-size: 8.7891rpx /* 12px -> 8.7891rpx */;
          color: #ff5722;
          background-color: rgba(255, 107, 70, 0.1);
          border: 1px #ff5722 solid;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      ::v-deep {
        //表头
        .uni-table-th {
          height: 32.959rpx /* 45px -> 32.959rpx */;
          font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
          color: #000;
          font-weight: 400;
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
    }
  }
}
</style>
