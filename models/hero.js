const mongoose = require('mongoose')

const heroSchema = mongoose.Schema({
	name: String,
	age: Number,
	sex: String,
	address: String,
  dowhat: [],
  imgArr: [],
  favourite: String,
  explain: String
}, { collection: 'myhero' })

const Hero = module.exports = mongoose.model('hero', heroSchema)