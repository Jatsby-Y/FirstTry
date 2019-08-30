const express = require('express')
const router = express.Router()
const Hero = require('../models/hero')

router.post('/login', (req, res) => {
	if (req.body.username === '123' && req.body.password === 'qaz') {
		return res.send({
			status: 200,
			info: '欢迎来到德莱联盟'
		})
	}
})

router.get('/getall', (req, res) => {
	Hero.find({})
		.sort({ update_at: -1 })
		.then(heros => {
			res.json(heros)
		})
		.catch(err => {
			res.json(err)
		})
})

router.post('/search', (req, res) => {
	var heroOrientation = new RegExp(req.body.heroOrientation),
			heroSex = req.body.heroSex,
			heroName = req.body.heroName,
			pageNumber = req.body.pageNumber,
			pageRow = req.body.pageRow;
	var sqlObj = {}
	if (heroOrientation) {
		sqlObj.dowhat = heroOrientation
	}
	if (heroSex) {
		sqlObj.sex = heroSex
	}
	if (heroName) {
		sqlObj.name = heroName
	}
	Hero.find(sqlObj).skip((pageNumber - 1) * pageRow).limit(pageRow).exec((err, result) => {
		if (err) {
			res.json({
				status: 'fail',
				error: err
			})
		} else {
			Hero.find(sqlObj, (err, heros) => {
				res.json({
					status: 'success',
					heroList: result,
					total: heros.length
				})
			})
		}
	})
})

router.get('/getDetail/:id', (req, res) => {
	Hero.findById(req.params.id)
		.then(hero => {
			res.json(hero)
		})
		.catch(err => {
			res.json(err)
		})
})

router.post('/addHero', (req, res) => {
	Hero.create(req.body, (err, hero) => {
		if (err) {
			res.json({
				status: 'fail',
				message: err
			})
		} else {
			res.json({
				status: 'success',
				message: '添加成功'
			})
		}
	})
})

router.post('/modifyHero/:id', (req, res) => {
	Hero.findOneAndUpdate(
		{ _id: req.params.id},
		{
			$set: {
				name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        address: req.body.address,
        dowhat: req.body.dowhat,
        favourite: req.body.favourite,
        explain: req.body.explain
			}
		},
		{
			new: true
		}
	)
		.then(() => {
			res.json({
				status: 'success',
				message: '修改成功',
				data: req.body
			})
		})
    .catch(() => {
			res.json({
				status: 'fail',
				message: '修改失败'
			})
		})
})

router.put('/addPicture/:id', (req, res) => {
	Hero.findOneAndUpdate(
		{ _id: req.params.id},
		{
			$push: {
				imgArr: req.body.url
			}
		},
		{
			new: true
		}
	)
		.then(() => res.json({
			status: 'success',
		}))
    .catch(() => res.json({
			status: 'fail'
		}))
})

router.get('/removeHero/:id', (req, res) => {
  Hero.findOneAndRemove({
    _id: req.params.id
  })
    .then(() => res.json({
			status: 'success'
		}))
    .catch(() => res.json({
			status: 'fail'
		}))
})

module.exports = router;
