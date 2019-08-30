const express = require('express')
const app = express()
const hero = require('./router/hero')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/test')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', hero)

app.listen(3000, () => {
	console.log('welcome come to 3000')
})