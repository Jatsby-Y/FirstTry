<template>
	<div class="detailPage">
		<div class="goback" >
		<el-button type="primary" size="small" icon="el-icon-arrow-left" @click="Goback">返回上一页</el-button>
		</div>
		<el-carousel :interval="2000" type="card" indicator-position="outside" height="250px">
			<el-carousel-item v-for="(item, index) in imgArr" :key="index">
				<img :src="item" alt="" class="image">
			</el-carousel-item>
		</el-carousel>
		<main class="mainContent">
			<section class="main-left">
				<h3 class="detail-title">召唤师名称</h3>
				<p class="detail-info">{{ name }}</p>
				<h3 class="detail-title">背景介绍</h3>
				<p class="detail-info">{{ explain }}</p>
			</section>
			<section class="main-right">
				<h3 class="detail-title">Personal Information
					<span class="email">Email: 123456789@163.com</span>
				</h3>
				<div id="echartArea"></div>
			</section>
		</main>
	</div>
</template>

<script>

import { requestDetail } from '../api/api'

// 引入 ECharts 主模块
var echarts = require('echarts')
require('echarts/lib/chart/bar')
// 引入饼图
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
	name: 'detail',
	data: () => ({
		imgArr: [],
		name: '',
		explain: ''
	}),
	mounted() {
		this.getDetailInfo(this.$route.params.id)

		// 初始化echarts实例
		var myChart = echarts.init(document.getElementById('echartArea'))
		myChart.setOption({
			backgroundColor: '#2c343c',
			bottom: 20,
			title: {
				text: 'Technology stack（个人技术栈）',
				left: 'center',
				top: 20,
				textStyle: {
					color: '#ccc'
				},
				subtext: '👆个人地址👆',
				sublink: 'https://baidu.com',
				subtextStyle: {
					color: '#fff',
					fontSize: 15,
					fontFamily:'monospace',
					fontStyle: 'italic',
					align: 'right'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{c} ({d}%)'
			},
			visualMap: {
				show: false,
        min: 1,
        max: 10,
        inRange: {
            colorLightness: [0, 1]
        }
			},
			series: [
				{
					name: '',
					type: 'pie',
					radius: '55%',
					center: ['50%', '58%'],
					data: [
						{value:3, name:'CSS'},
						{value:5, name:'Vue全家桶'},
						{value:4, name:'原生Javascript'},
						{value:3, name:'Node.js（express）'},
						{value:2, name:'Mongodb'},
						{value:2, name:'ES6'},
						{value:2.5, name:'HTTP'}
					].sort((a, b) => {
						return a.value - b.value
					}),
					roseType: 'radius',
					label: {
						normal: {
							textStyle: {
								color: 'rgba(255, 255, 255, 0.5)',
								fontSize: 16
							}
						}
					},
					labelLine: {
						normal: {
							lineStyle: {
								color: 'rgba(255, 255, 255, 0.5)'
							},
							smooth: 0,
							length: 10,
							length2: 20
						}
					},
					itemStyle: {
						normal: {
							color: 'azure',
							shadowBlur: 200,
							shadowColor: 'rgba(255, 0, 0, 0.5)'
						}
					},
					animationType: 'scale',
					animationEasing: 'elasticOut',
					animationDelay: function (idx) {
							return Math.random() * 200;
					}
				}
			]
		})
	},
	methods: {
		getDetailInfo(id) {
			requestDetail(id).then(res => {
				this.name = res.data.name
				this.imgArr = res.data.imgArr
				this.explain = res.data.explain
			})
				.catch(() => {
					this.$message({
						message: '获取失败',
						type: 'error'
					})
				})
		},
		Goback() {
			this.$router.go(-1)
		}
	}
}
</script>

<style lang="scss" scoped>
	.detailPage {
		width: 80%;
		margin: 50px auto;
	}
	.goback {
		margin-bottom: 20px;
		display: flex;
		justify-content: flex-end;
	}
	.image {
		width: 100%;
	}
	.mainContent {
		padding: 15px 0px;
		.main-left {
			width: 40%;
			float: left;
		}
		.main-right {
			width: 50%;
			float: right;
			.email {
				float: right;
			}
		}
		.detail-title {
			background: #ccc;
			padding: 5px 10px
		}
		.detail-info {
			line-height: 30px;
			font-size: 18px;
			font-style: italic;
			text-indent: 2em;
			text-align: left;
		}
		h3 {
			text-align: left;
			// color: black
		}
	}
	#echartArea {
		width: 100%;
    height: 340px;
		padding-bottom: 0px
	}
</style>