import axios from 'axios'

axios.defaults.baseURL = '/api'

export const requestLogin = params => {
	return axios.post('/api/login', params)
}
export const requestALL = params => {
	return axios.get('/api/getall', params)
}
export const requestRemove = id => {
	return axios.get(`/api/removeHero/${id}`)
}
export const requestDetail = id => {
	return axios.get(`/api/getDetail/${id}`)
}
export const requestAddData = params => {
	return axios.post('/api/addHero', params)
}
export const requestSearch = params => {
	return axios.post('/api/search', params)
}
export const requestModify = (id, params) => {
	return axios.post(`/api/modifyHero/${id}`, params)
}
export const requestAddPic = (id, params) => {
	return axios.put(`/api/addPicture/${id}`, params)
}
