<template>
  <div class="login-page">
    <el-form ref="formData" :model="formLogin" label-width="100px" :rules="rules" class="formStyle">
      <el-form-item label="username" prop="username" class="formLabel">
        <el-input size="mini" v-model="formLogin.username" placeholder="Please input your username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password" class="formLabel">
        <el-input style="padding-right: 4px" type="password" size="mini" v-model="formLogin.password" placeholder="Please input your password"></el-input>
      </el-form-item>
      <el-form-item  class="login">
        <el-button type="primary" size="mini" @click.native.prevent="Login" :loading="isLoading">Login</el-button>
        <el-button type="primary" size="mini" @click.native.prevent="Reset">Reset</el-button>
      </el-form-item>
    </el-form>
      </div>
</template>

<script>
import { requestLogin } from '../api/api'

export default {
  name: 'Login',
  data () {
    return {
      isLoading: false,
      formLogin: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    Login() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.isLoading = true
          let parameters = {
            username: this.formLogin.username,
            password: this.formLogin.password
          }
          requestLogin(parameters).then(data => {
            if (data.data.status === 200) {
              this.isLoading = false
              this.$router.push({path: '/list'})
            }
          })
        } else {
          alert('error')
        }
      })
    },
    Reset() {
      this.$refs.formData.resetFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style> 
  .login-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../assets/image/bg1.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: 100% 100%;
    position: fixed;
  }
  .formLabel .el-form-item__label {
    color: rgb(190, 169, 169)
  }
  .formStyle {
    width: auto;
    font-weight: bold;
    border: 2px solid rgb(4, 65, 65);
    padding: 20px 26px 0px 10px
  }
</style>
