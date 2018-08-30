<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
   
    <div class="row">
             
       <form id="LoginForm">
            <div class="logo"><img src="@/assets/playout.png"  height="150px" alt="Whoa Playout"></div>
            <div class="form-group">
                <label for="InputUsername">Username</label>
                <input type="text" class="form-control" @keyup="Username = $event.target.value" id="InputUsername"  placeholder="Enter Username">
                
            </div>
            <div class="form-group">
                <label for="InputPassword">Password</label>
                <input type="password" class="form-control" @keyup="Password = $event.target.value" id="InputPassword" placeholder="Password">
            </div>
            <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            
            <button-spinner
    :isLoading="isLoading" 
    :disabled="isLoading"
    :status="status" type="submit" v-on:click.native="login">
        <span ><i class="fas fa-sign-in-alt"></i> Sign In</span>
</button-spinner>
            </form>
     </div> 
   
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import router from '@/router'
import axios from 'axios'
import md5 from 'md5'

export default {
  name: 'Login',
  data() {
      return {
          ServerApi: "http://iptv-api.whoa.ph:9001",
        Username: '',
        Password: '',
        isLoading: false,
        status: ''
      }
  },
   methods: {
    login: function (event) {
     this.isLoading = true
     axios.post(this.ServerApi + "/api/v1/user/login",JSON.stringify({
          Username: this.Username,
          Password: md5(this.Password),
        }))
      .then((response)  =>  {
         this.isLoading = false
          if(response.data.userid != 0) {
               sessionStorage.LoggedUser=JSON.stringify(response.data); 
            router.push('playout')
          } else {
               alert(response.data.remarks)
          }
       
      }, (error)  =>  {
          this.isLoading = false
       alert("Invalid User Credintials!")
       //setTimeout(function() {this.isLoading = false}, 800)
      })
    
    return false;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app .application.theme--light {
    background-color: #121212 !important;
 }

#LoginForm {
    width: 400px;
    margin: 3% auto;
}
#LoginForm .logo {
    text-align: center;
}
#LoginForm .vue-btn {
    background: #EB6E07 !important;
    border: 4px solid #5F2B00 !important;
    padding: 6px 0 !important;
    font-size: 1.5em !important;
    height: 50px !important;
   width: 100%;
   color: #f0f0f0;
}

#LoginForm input {
     border: 4px solid #5F2B00;
      background: #1E140C;
      color: #f0f0f0;
      padding: 20px;
      text-align: center;
}
</style>
