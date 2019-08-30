<template>
	<div class="list">
		<el-row  class="listHead">
			<el-col :span="6">
				<div class="heroName">英雄：
					<el-input v-model="heroName" size="mini" placeholder="请输入英雄名称"></el-input>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="heroOrientation">位置：
					<el-select size="mini" v-model="heroOrientation" placeholder="请选择位置">
						<el-option v-for="item in heroOrientations" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="heroSex">性别：
					<el-select size="mini" v-model="heroSex" placeholder="请选择性别">
						<el-option v-for="item in heroSexs" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="funcButton">
					<el-button type="info" size="mini" icon="el-icon-view" @click="GetAllInfo">获取</el-button>
					<el-button type="primary" size="mini" icon="el-icon-search" @keyup.enter.native="Search" @click="Search">查询</el-button>
					<el-button type="warning" size="mini" icon="el-icon-delete" @click="ClearAll">清空</el-button>
				</div>
			</el-col>
		</el-row>
		<div class="addNav">
			<el-button type="primary" @click="Add" icon="el-icon-plus">添加</el-button>
		</div>
		<el-table :data="tableData" element-loading-text="加载中" v-loading.fullscreen.lock="loading"
			 empty-text="暂时没有数据" border style="width: 100%">
			<el-table-column prop="name" label="英雄" align="center" width="100px"></el-table-column>
			<el-table-column prop="age" label="年龄" align="center" width="100px"></el-table-column>
			<el-table-column label="性别" align="center" width="100px">
				<template slot-scope="scope">
					<i class="iconfont myIcon-man" v-if="scope.row.sex === 'man'"></i>
					<i class="iconfont myIcon-woman" v-if="scope.row.sex === 'woman'"></i>
					{{ JudegSex(scope.row.sex) }}
				</template>
			</el-table-column>
			<el-table-column prop="address" label="籍贯" align="center" width="120px"></el-table-column>
			<el-table-column label="位置" align="center" width="120px">
				<template slot-scope="scope">
					{{ JudegOrientation(scope.row.dowhat) }}
				</template>
			</el-table-column>
			<el-table-column prop="favourite" label="台词" align="center" width="220px"></el-table-column>
			<el-table-column label="操作" align="center" width="auto">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="ToDetail(scope.row['_id'])">详情</el-button>
					<el-button size="mini" type="success" @click="ModifyInfo(scope.row)">修改</el-button>
					<el-button size="mini" type="danger" @click="DeleteHero(scope.row['_id'])">删除</el-button>
					<el-button size="mini" type="warning" @click="AddPic(scope.row['_id'])">添加图片</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination v-if="paginationShow" class="pagination" @current-change="handleCurrentChange"
			:current-page.sync="currentPage" :page-size="3" :total="infoLength" layout="total, prev, pager, next, jumper">
		</el-pagination>
		<!-- add data -->
		<el-dialog title="Add Data" :visible.sync="addDataVisible" class="addArea" custom-class="addDiaArea" @close="AddDataReset">
			<el-form :inline="true" :model="addForm" class="addForm" :rules="rules" status-icon ref="addForm">
				<el-form-item label="英雄：" :label-width="'120px'" prop="name">
					<el-input v-model="addForm.name" size="mini" placeholder="Please fill in the name of hero"></el-input>
				</el-form-item>
				<el-form-item label="年龄：" :label-width="'120px'" prop="age">
					<el-input v-model.number="addForm.age" size="mini" placeholder="Please fill in the age of hero"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="'120px'" prop="sex" >
					<el-select v-model="addForm.sex" size="mini"  placeholder="Please choose the age of hero" class="sexArea">
						<el-option label="男" value="man"></el-option>
						<el-option label="女" value="woman"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="籍贯：" :label-width="'120px'" prop="address">
					<el-input v-model="addForm.address" size="mini" placeholder="Please fill in the address of hero"></el-input>
				</el-form-item>
				<el-form-item label="位置：" :label-width="'120px'" prop="dowhat">
					<el-select v-model="addForm.dowhat" size="mini"  placeholder="Please choose the orientation of hero" multiple>
						<el-option label="上单" value="top"></el-option>
						<el-option label="打野" value="jungle"></el-option>
						<el-option label="中单" value="mid"></el-option>
						<el-option label="射手" value="ad"></el-option>
						<el-option label="辅助" value="support"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="台词：" :label-width="'120px'" prop="favourite">
					<el-input v-model="addForm.favourite" size="mini" placeholder="Please fill in the lines of hero"></el-input>
				</el-form-item>
				<el-form-item label="背景：" :label-width="'120px'" prop="explain">
					<el-input v-model="addForm.explain" size="mini" type="textarea" style="width: 220px" :rows="5" placeholder="Please fill in the background of hero"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="addFormFooter">
				<el-button @click="addDataVisible = false">取消</el-button>
				<el-button type="primary" @click="AddDataSure">确定</el-button>
			</span>
		</el-dialog>
		<!-- modify data -->
		<el-dialog title="Modify Data" :visible.sync="modifyDataVisible" class="addArea" custom-class="addDiaArea" @close="ModifyDataReset">
			<el-form :inline="true" :model="modifyForm" class="addForm" :rules="rules" status-icon ref="modifyForm">
				<el-form-item label="英雄：" :label-width="'120px'" prop="name">
					<el-input v-model="modifyForm.name" size="mini" placeholder="Please fill in the name of hero"></el-input>
				</el-form-item>
				<el-form-item label="年龄：" :label-width="'120px'" prop="age">
					<el-input v-model.number="modifyForm.age" size="mini" placeholder="Please fill in the age of hero"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="'120px'" prop="sex" >
					<el-select v-model="modifyForm.sex" size="mini"  placeholder="Please choose the age of hero" class="sexArea">
						<el-option label="男" value="man"></el-option>
						<el-option label="女" value="woman"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="籍贯：" :label-width="'120px'" prop="address">
					<el-input v-model="modifyForm.address" size="mini" placeholder="Please fill in the address of hero"></el-input>
				</el-form-item>
				<el-form-item label="位置：" :label-width="'120px'" prop="dowhat">
					<el-select v-model="modifyForm.dowhat" size="mini"  placeholder="Please choose the orientation of hero" multiple>
						<el-option label="上单" value="top"></el-option>
						<el-option label="打野" value="jungle"></el-option>
						<el-option label="中单" value="mid"></el-option>
						<el-option label="射手" value="ad"></el-option>
						<el-option label="辅助" value="support"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="台词：" :label-width="'120px'" prop="favourite">
					<el-input v-model="modifyForm.favourite" size="mini" placeholder="Please fill in the lines of hero"></el-input>
				</el-form-item>
				<el-form-item label="背景：" :label-width="'120px'" prop="explain">
					<el-input v-model="modifyForm.explain" size="mini" type="textarea" style="width: 220px" :rows="5" placeholder="Please fill in the background of hero"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="addFormFooter">
				<el-button @click="modifyDataVisible = false">取消</el-button>
				<el-button type="primary" @click="ModifyDataSure">确定</el-button>
			</span>
		</el-dialog>
		<!-- add picture -->
		<el-dialog title="Add Picture" :visible.sync="addPicVisible" class="addArea" custom-class="addDiaArea" @close="AddPicReset">
			<el-form :model="addPicForm">
				<el-form-item label="图片Url" label-width="'120px'">
					<el-input v-model="addPicForm.url" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="addFormFooter">
				<el-button @click="addPicVisible = false">取消</el-button>
				<el-button type="primary" @click="AddPictureSure">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>

import { requestALL } from '../api/api'
import { requestAddData } from '../api/api'
import { requestSearch } from '../api/api'
import { requestModify } from '../api/api'
import { requestRemove } from '../api/api'
import { requestAddPic } from '../api/api'

export default {
	name: 'list',
	data: () => ({
		addDataVisible: false,
		modifyDataVisible: false,
		addPicVisible: false,
		addForm: {
			name: '',
			age: '',
			sex: '',
			address: '',
			dowhat: [],
			favourite: '',
			explain: ''
		},
		modifyForm: {
			name: '',
			age: '',
			sex: '',
			address: '',
			dowhat: [],
			favourite: '',
			explain: ''
		},
		modifyId: '',
		addPictureId: '',
		addPicForm: {
			url: ''
		},
		paginationShow: true,
		infoLength: 0,
		currentPage: 1,
		pageNumber: 1,
		heroName: '',
		heroOrientation: '',
		heroOrientations: [
			{
				label: "中单",
				value: "mid"
			}, {
				label: "上单",
				value: "top"
			}, {
				label: "辅助",
				value: "support"
			}, {
				label: "射手",
				value: "ad"
			}, {
				label: "打野",
				value: "jungle"
			}
		],
		heroSex: '',
		heroSexs: [
			{
				value: 'man',
				label: '男'
			}, {
				value: 'woman',
				label: '女'
			}
		],
		tableData: [],
		loading: false,
		// add data rules
		rules: {
        name: [
          { required: true, message: "请输入英雄名称", trigger: "blur" }
        ],
        age: [
          { required: true, message: "请输入英雄年龄", trigger: "blur" },
          { type: 'number', message: "年龄必须为数字值" }
        ],
        sex: [
          { required: true, message: "请选择英雄性别", trigger: "change" },
          { required: true, message: "请选择英雄性别", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入英雄籍贯", trigger: "blur" }
        ],
        dowhat: [
          {
            required: true,
            message: "至少选择一个英雄位置",
            trigger: "change"
          },
          { required: true, message: "至少选择一个英雄位置", trigger: "blur" }
        ],
        favourite: [
          { required: true, message: "请输入英雄台词", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "请输入英雄背景", trigger: "blur" }
        ]
      },
	}),
	mounted() {
		var queryObj = JSON.parse(sessionStorage.getItem('detailInfo'))
		if (queryObj) {
			this.heroName = queryObj.heroName
			this.heroOrientation = queryObj.heroOrientation
			this.heroSex = queryObj.heroSex
			this.currentPage = queryObj.currentPage 
			this.handleCurrentChange(this.currentPage)
		}
	},
	methods: {
		// 获取所有信息
		GetAllInfo() {
			this.loading = true
			var aa = {}
			requestALL(aa).then(res => {
				this.loading = false
				this.tableData = res.data
				this.infoLength = res.data.length
			})
		},
		// 查询
		Search() {
			this.paginationShow = false
			var searchData = {
				heroName: this.heroName,
				heroOrientation: this.heroOrientation,
				heroSex: this.heroSex,
				pageNumber: this.pageNumber,
				pageRow: 3
			}
			this.loading = true
			requestSearch(searchData).then(res => {
				this.paginationShow = true
				this.loading = false
				if (res.data.status === 'success') {
					this.tableData = res.data.heroList
					this.infoLength = res.data.total;
				} else {
					this.tableData = []
					this.$message({
						message: '查询出错',
						type: 'error'
					})
				}
			}).catch(error => {
				this.paginationShow = true
			})
		},
		// 清楚查询记录
		ClearAll() {
			this.heroName = ''
			this.heroOrientation = ''
			this.heroSex = ''
		},
		JudegSex(sex) {
			if (sex === 'man') {
				return '汉子'
			} else {
				return '妹子'
			}
		},
		JudegOrientation(position) {
			var positionObject = {
				jungle: '打野',
        mid: '中单',
        top: '上单',
        support: '辅助',
        ad: '射手'
			}
			let heroOrients = []
			position.forEach(element => {
				heroOrients.push(positionObject[element])
			})
			return heroOrients.toString()
		},
		handleCurrentChange(val) {
			this.pageNumber = `${val}`
			this.Search()
		},
		// Detail page
		ToDetail(id) {
			var detailInfo = {
				heroName: this.heroName,
        heroOrientation: this.heroOrientation,
        heroSex: this.heroSex,
        currentPage: this.currentPage
			}
			sessionStorage.setItem('detailInfo', JSON.stringify(detailInfo))
			this.$router.push({path: `league/${id}`})
		},
		DeleteHero(id) {
			var that = this
			var deleteId = id
			this.$confirm('此操作将从数据库永久删除该英雄，是否继续', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					requestRemove(deleteId).then(res => {
						if (res.data.status === 'success') {
							this.$message({
								message: '删除成功',
								type: 'success',
								onClose() {
									that.Search()
								}
							})
						} else {
							this.$message({
								message: '删除失败',
								type: 'error',
								onClose() {
									that.Search()
								}
							})
						}
					})
						.catch((error) => {
							console.log(error)
						})
				})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已放弃删除"
						})
					})
		},
		// add picture
		AddPic(id) {
			this.addPictureId = id
			this.addPicVisible = true
		},
		// close reset pic
		AddPicReset() {
			this.addPicForm.url = ''
		},
		AddPictureSure() {
			var that = this
			if (!this.addPicForm.url.trim()) {
				this.$notify.error({
					title: '错误',
					message: '请输入正确的图片地址'
				})
				return;
			}
			var picObj = {
				url: this.addPicForm.url
			}
			requestAddPic(this.addPictureId, picObj).then(res => {
				if (res.data.status === 'success') {
					this.$message({
						message: '添加成功',
						type: 'success',
						onClose() {
							that.Search()
						}
					})
					this.addPicVisible = false
				} else {
					this.$message({
						message: '添加失败',
						type: 'error',
						onClose() {
							that.Search()
						}
					})
					this.addPicVisible = false
				}
			})
				.catch(() => {
					this.$message({
						message: '添加失败',
						type: 'error',
						onClose() {
							that.Search()
						}
					})
					this.addPicVisible = false
				})
		},
		// modify data
		ModifyInfo(row) {
			this.modifyDataVisible = true
			this.modifyForm = Object.assign({}, row)
			this.modifyId = row['_id']
		},
		ModifyDataReset() {
			this.$refs.modifyForm.resetFields()
		},
		ModifyDataSure() {
			var that = this
			this.$refs.modifyForm.validate(valid => {
				if (valid) {
					var modifyData = this.modifyForm
					requestModify(this.modifyId, modifyData).then(res => {
						if (res.data.status === 'success') {
							this.$message({
								message: res.data.message,
								type: 'success',
								onClose() {
									that.Search()
								}
							})
							this.modifyDataVisible = false
						} else {
							this.$message({
								message: res.data.message,
								type: 'fail',
								onClose() {
									this.Search()
								}
							})
							this.modifyDataVisible = false
						}
					})
				} else {
					alert('submit error!')
				}
			})
		},
		// add data
		Add() {
			this.addDataVisible = true
		},
		AddDataReset() {
			this.$refs.addForm.resetFields()
		},
		AddDataSure() {
			var that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					var addData = this.addForm
					requestAddData(addData).then(res => {
						if (res.data.status === 'success') {
							this.$message({
								message: res.data.message,
								type: 'success',
								onClose() {
									that.Search()
								}
							})
							this.addDataVisible = false
						} else {
							this.$message({
								message: res.data.message,
								type: 'fail',
								onClose() {
									this.Search()
								}
							})
							this.addDataVisible = false
						}
					})
				} else {
					alert('submit error!')
				}
			})
		},
	}
}
</script>

<style lang="scss">
	.list {
		width: 80%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.addNav {
			border-top: 1px solid black;
			border-bottom: 1px solid black;
			padding: 30px 0;
			margin-bottom: 50px;
			margin-top: 50px;
			display: flex;
			justify-content: flex-start;
		}
		.pagination {
			float: right;
			margin-top: 20px;
		}
		.addArea .el-input{
			width: 200px;
		}
		.addDiaArea {
			width: 800px;
		}
		.addForm {
			overflow: hidden;
		}
		.addForm .el-form-item {
			float: left;
		}
		.addForm .el-input {
			width: 220px;
		}
		.el-input {
			width: auto
		}
	}
</style>