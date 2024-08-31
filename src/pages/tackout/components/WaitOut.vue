<template>
  <view class="waitOut">
    <NotOut v-if="showReason" @confirm="onConfirm" @cancel="onCancel" />
    <view class="header">
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
          <checkbox-group class="checkbox-group" v-if="teachersList.length > 0" @change="selectTeachersList">
            <label class="checkbox" v-for="item in teachersList" :key="item.Id">
              <view>
                <checkbox :value="item.Name" :checked="item.Id === selectedTeacherId" />
              </view>
              <view> {{ item.Name }}</view>
            </label>
          </checkbox-group>
          <view v-else class="checkbox-group-none">暂无数据</view>
        </view>
      </view>
      <button class="tack-btn" @click="takeOutSelectedStudents">
        <uni-icons type="paperplane" color="#fff" size="35"></uni-icons><text>带出已勾选学员</text>
      </button>
    </view>
    <view class="main">
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
      <view class="student-list">
        <uni-table
          ref="studentTable"
          border
          type="selection"
          emptyText="暂无更多数据"
          @selection-change="selectStudentsList"
        >
          <uni-tr>
            <uni-th width="160" align="center">学员姓名</uni-th>
            <uni-th width="200" align="center">申请会见家属</uni-th>
            <uni-th width="280" align="center">学员所在大队</uni-th>
            <uni-th width="500" align="center">学员家庭住址</uni-th>
            <uni-th width="230" align="center">审核操作</uni-th>
          </uni-tr>
          <uni-tr style="" v-for="(student, index) in studentsList" :key="student.Id">
            <uni-td align="center"> {{ student.CadetName }}</uni-td>
            <uni-td align="center">
              {{ student.KinName }}
              <!-- <text style="padding: 0 3.6621rpx" v-for="(family, index) in item.familyName" :key="index">
                {{ family }}
              </text> -->
            </uni-td>
            <uni-td align="center">{{ student.CollegeName }}</uni-td>
            <uni-td align="center">{{ student.DepartPath }}</uni-td>
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
  </view>
</template>

<script setup>
import NotOut from './NotOut.vue'
import { getStudentsList_API, getTeachersList_API, pushNotOut_API, pushWaitOut_API, pushTackOut_API } from '@/api/data'
import { userLoginStore } from '@/store/login.js'
import { onLoad } from '@dcloudio/uni-app'
import { ref, nextTick } from 'vue'
const loginStore = userLoginStore()
//所有队伍列表
const teamsList = ref([])
//下拉框选中队伍(默认为当前登录大队)
const selectTeam = ref(null)

//民警列表数据
const teachersList = ref([])
//教员列表id匹配默认选中
const selectedTeacherId = ref('')
//默认选中民警
const selectedTeachers = ref('请选择民警')
const tackoutTeachersIds = ref([])
// 当前选择的民警  选中民警数量
const selectedTeachersLength = ref(0)

//当前队伍学员信息
const studentsList = ref([])
// 选择的学员列表   选中学员数量
const selectedStudents = ref([])
const selectedStudentsLength = ref(0)

//获取学员表格元素,用于清空
// const studentTable = ref(null)

// 隐藏不带出理由弹窗
const showReason = ref(false)
//不带出学员的索引
const notIndex = ref(null)
const showBtn = ref(false)
// const showBtnText = ref('选择民警')
const studentTable = ref(null)
//获取待带出学员数据
const getStudentsList = async (data = {}) => {
  const studentsListRes = await getStudentsList_API(data)
  if (studentsListRes.code === 200) {
    studentsList.value = studentsListRes.data
    // console.log(studentsList.value)
  } else {
    uni.showToast({
      title: '获取学员信息失败',
      icon: 'none'
    })
  }
}
//获取教员列表
const getTeachersList = async (data = {}) => {
  const teachersListRes = await getTeachersList_API(data)
  if (teachersListRes.code === 200) {
    teachersList.value = teachersListRes.data
  } else {
    uni.showToast({
      title: '获取教员信息失败',
      icon: 'none'
    })
  }
  // console.log(teachersList.value);
}
const checkedTeacher = async () => {
  if (teachersList.value.find(item => item.Id === loginStore.loginInfo.Id)) {
    selectedTeacherId.value = teachersList.value.find(item => item.Id === loginStore.loginInfo.Id).Id
    selectedTeachers.value = teachersList.value.find(item => item.Id === loginStore.loginInfo.Id).Name
    selectedTeachersLength.value = 1
  }
}
// //所有学员 或者 部门学员
// const selectStudents = async () => {
//   if (selectTeam.value) {
//     await getStudentsList({ CollegeId: selectTeam.value })
//   } else {
//     await getStudentsList()
//   }
// }

onLoad(async () => {
  // 部门列表
  teamsList.value = loginStore.teamsList
  //根据登录信息,匹配默认选中部门
  if (teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId)) {
    selectTeam.value = teamsList.value.find(item => item.value === loginStore.loginInfo.CollegeId).value
  }
  //默认登录部门下的学员信息
  await getStudentsList({ CollegeId: selectTeam.value })
  //教员信息
  await getTeachersList({ CollegeId: selectTeam.value })
  // teachersList.value = loginStore.teachersList
  //根据登录信息,匹配默认选中教员
  await checkedTeacher()
  // else {
  //   if (loginStore.loginInfo.RealName) {
  //     selectedTeachers.value = loginStore.loginInfo.RealName
  //   }
  // }
})
//下拉框更改部门查询学员
const teamListChange = async e => {
  selectTeam.value = e // e 为选中的部门id
}
//查询和刷新,学员数据
const updata = async () => {
  selectedStudentsLength.value = 0
  selectedTeachersLength.value = 0
  studentsList.value = [
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '选择民警选择民警选择民警选择民警',
      KinName: '选择民警选择民警选择民警选择民警',
      CollegeName: '选择民警选择民警选择民警选择民警选择民警选择民警选择民警',
      DepartPath: '大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲大毛父亲'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    },
    {
      Id: 1001,
      CadetName: '大毛',
      KinName: '大毛父亲',
      CollegeName: 'CollegeName',
      DepartPath: 'DepartPath'
    }
  ]
  teachersList.value = [
    { Id: 4356, Name: '李是撒旦电商莉' },
    { Id: 4355, Name: '罗啊啊凯' },
    { Id: 4350, Name: '李涛啊' },
    { Id: 4356, Name: '李莉' },
    { Id: 4355, Name: '罗凯' },
    { Id: 4350, Name: '李涛' },
    { Id: 4356, Name: '李莉' },
    { Id: 4355, Name: '罗凯' },
    { Id: 4350, Name: '李涛' },
    { Id: 4356, Name: '李莉' },
    { Id: 4355, Name: '罗凯' },
    { Id: 4350, Name: '李涛' }
  ]
  teamsList.value = [
    { value: 331, text: '一大队' },
    { value: 332, text: '二大队' },
    { value: 333, text: '三大队' },
    { value: 334, text: '四大队' },
    { value: 335, text: '五大队' },
    { value: 336, text: '六大队' },
    { value: 1332, text: '七大队' },
    { value: 1333, text: '八大队' },
    { value: 1334, text: '九大队' },
    { value: 1335, text: '十大队' },
    { value: 1347, text: '十一大队' },
    { value: 1348, text: '十二大队' },
    { value: 331, text: '一大队' },
    { value: 332, text: '二大队' },
    { value: 333, text: '三大队' },
    { value: 334, text: '四大队' },
    { value: 335, text: '五大队' },
    { value: 336, text: '六大队' },
    { value: 1332, text: '七大队' },
    { value: 1333, text: '八大队' },
    { value: 1334, text: '九大队' },
    { value: 1335, text: '十大队' },
    { value: 1347, text: '十一大队' },
    { value: 1348, text: '十二大队' }
  ]
  // studentTable.value.clearSelection()
  await getStudentsList({ CollegeId: selectTeam.value })
  //教员信息
  await getTeachersList({ CollegeId: selectTeam.value })
  await checkedTeacher()
}
//选择教员列表按钮
const showSelectTeacher = () => {
  showBtn.value = !showBtn.value
  if (showBtn.value) {
    document.addEventListener('click', handleDocumentClick)
  }
}
const handleDocumentClick = event => {
  if (!event.target.closest('.teachers-select')) {
    showBtn.value = false
    document.removeEventListener('click', handleDocumentClick)
  }
}

const handleWrapperClick = event => {
  event.stopPropagation()
}
// 带出已勾选学员
const takeOutSelectedStudents = () => {
  if (selectedTeachersLength.value <= 0) {
    uni.showToast({
      title: '请先选择民警',
      icon: 'none'
    })
    return
  }
  if (selectedStudentsLength.value <= 0) {
    uni.showToast({
      title: '请先选择学员',
      icon: 'none'
    })
    return
  }
  // 获取已选择学员的姓名列表
  // const studentNames = selectedStudents.value.map(student => student.CadetName).join('  ')
  // 弹出确认对话框
  uni.showModal({
    title: '确认带出学员',
    // content: `${studentNames}`,
    success: async res => {
      if (res.confirm) {
        // console.log('用户点击确定')
        // 记录带出信息
        // selectedStudents.value.forEach(student => {
        //   todayList.value = {
        //     name: student.name,
        //     familyName: student.familyName,
        //     teamName: student.teamName,
        //     address: student.address,
        //     status: '已带出',
        //     info: '无',
        //     teacherNames: selectedTeachers.value
        //   }
        //   console.log(todayList.value)
        //   // await pushTodayList_API(todayList.value)
        // })
        // selectedStudents.value.forEach(student => {
        //   const index = studentsList.value.findIndex(item => item.Id === student.Id)
        //   if (index !== -1) {
        //     studentsList.value.splice(index, 1)
        //   }
        // })
        console.log(selectedStudents.value.map(student => student.Id).join(','), tackoutTeachersIds.value.join(','))
        await pushTackOut_API({
          Ids: selectedStudents.value.map(student => student.Id).join(','),
          PolicemanIds: tackoutTeachersIds.value.join(',')
        })
        // 清空已选择的学员列表
        selectedStudents.value = []
        // studentTable.value.clearSelection()
        // await selectStudents()
        await getStudentsList({ CollegeId: selectTeam.value })
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    }
  })
}
// 选择民警 监听民警选择变化 并更新 selectedTeachers
const selectTeachersList = selections => {
  selectedTeachersLength.value = selections.detail.value.length // 选中民警数量
  if (selectedTeachersLength.value > 0) {
    // console.log(selections.detail.value)
    tackoutTeachersIds.value = selections.detail.value
      .map(name => {
        const tackTeachers = teachersList.value.find(teacher => teacher.Name === name)
        return tackTeachers ? tackTeachers.Id : null
      })
      .filter(id => id !== null) // 过滤掉未匹配到的 null 值
    selectedTeachers.value = selections.detail.value.join('，')
  } else {
    tackoutTeachersIds.value = []
    selectedTeachers.value = '请选择民警'
  }
}
//选择学员 监听学员选择变化 并更新 selectedStudents
const selectStudentsList = selections => {
  selectedStudentsLength.value = selections.detail.index.length // 选中学员数量
  // console.log(selections.detail.index)
  // 限制最多选择20个学员
  // console.log(selectedStudentsLength.value)
  if (selectedStudentsLength.value > 20) {
    //使用 nextTick 确保 DOM 更新后清除选中的学员
    //用于在下次 DOM 更新循环结束之后执行延迟回调。
    nextTick(() => {
      studentTable.value.clearSelection()
      selections.detail.index.slice(0, 20).forEach(item => {
        studentTable.value.toggleRowSelection(item, true)
      })
      selectedStudents.value = selections.detail.index.slice(0, 20).map(index => studentsList.value[index])
      // console.log(selectedStudents.value)
      uni.showToast({
        title: '一次最多选择20个学员',
        icon: 'none'
      })
    })
    return
  }
  if (selectedStudentsLength.value > 0) {
    selectedStudents.value = selections.detail.index.map(index => studentsList.value[index])
    // console.log(selectedStudents.value)
  } else {
    selectedStudents.value = []
  }
}
//暂不带出,移至列表末尾
const waitOut = async index => {
  await pushWaitOut_API(studentsList.value[index].Id)
  await getStudentsList({ CollegeId: selectTeam.value })
  // const waitOutStudent = studentsList.value.splice(index, 1)[0] // 移除选中的学员
  // studentsList.value.push(waitOutStudent) // 将移除的学员添加到末尾
}
//不带出
const notOut = index => {
  showReason.value = true //不带出理由弹窗
  notIndex.value = index // 记录待带出学员的索引
}
//隐藏不带出理由弹窗
const hideReason = () => {
  showReason.value = false
}
// 弹窗确认不带出
const onConfirm = async value => {
  //value 为不带出理由
  // todayList.value = {
  //   name: studentsList.value[notIndex.value].name,
  //   familyName: studentsList.value[notIndex.value].familyName,
  //   teamName: studentsList.value[notIndex.value].teamName,
  //   address: studentsList.value[notIndex.value].address,
  //   status: '不带出',
  //   info: value,
  //   teacherNames: selectedTeachers.value
  // }
  await pushNotOut_API({
    Id: studentsList.value[notIndex.value].Id,
    NoBringOutReasonId: value
  })
  await getStudentsList({ CollegeId: selectTeam.value })
  // studentsList.value.splice(notIndex.value, 1) // 移除选中的学员
  // console.log(value)
  hideReason()
  // await pushTodayList_API(todayList.value)
}
//弹窗取消操作
const onCancel = () => {
  hideReason()
}
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
          background-color: #ffffff;
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
            font-weight: 40073;
            width: 69.5801rpx /* 95px -> 69.5801rpx */;
            height: 20.5078rpx /* 28px -> 20.5078rpx */;
            line-height: 20.5078rpx /* 28px -> 20.5078rpx */;
            padding: 0 3.6621rpx /* 5px -> 3.6621rpx */;
            margin: 3.6621rpx /* 5px -> 3.6621rpx */ 0;
            background-color: #e9e9e9;
            border-radius: 5px;
          }
        }
        ::v-deep {
          .uni-label-pointer {
            font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
            :nth-child(2) {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .uni-checkbox-input {
            width: 11.7188rpx /* 16px -> 11.7188rpx */;
            height: 11.7188rpx /* 16px -> 11.7188rpx */;
            margin: 0 5.8594rpx /* 8px -> 5.8594rpx */ 0 0;
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
          background-color: #fff;
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
