export default {
    data:function (){
        return{
            email:'k@gmail.com',
            password:'k',
            serverMessage:'',
        }
    },
    template:`
 
            <div class="container mt-3">
            <h3 class="text-center">User Login</h3>

                    <form  @submit.prevent="submitForm" class="text-center" style="margin:35px 150px">
                            <div class="input-group mb-3 " >
                                <span class="input-group-text" id="basic-addon1">@</span>
                                <input type="email" v-model="email" class="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1" required><br/>
                                
                            </div>
                            <div class="input-group mb-3 " >
                                <span class="input-group-text" id="basic-addon1">@</span>
                                <input type="password" v-model="password" class="form-control" placeholder="Password" aria-label="Username" aria-describedby="basic-addon1" required>
                            </div>
                            <button class="btn btn-primary text">Login</button>
                            Don't have account? <router-link to='/Signup'>Create</router-link>  
                            <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                            <div>
                                {{this.serverMessage}}
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                        </div>
                    </form>
                    
            </div>
    `
    ,
    methods: {
   
        submitForm:function (){
          const postData ={
            email :this.email,
            password:this.password
        }
          const requestOptions = {
            method: "POST", // Use the POST method
            headers: {
              "Content-Type": "application/json", // Specify the content type as JSON
            },
            body: JSON.stringify(postData), // Convert the data to JSON format
          };
          //login?include_auth_token
          fetch('http://127.0.0.1:5000/login?include_auth_token',requestOptions).then((res)=>{return res.json()}).then(ress=>{
            if(ress.meta.code===400){
            console.log(ress.meta.code)
            if(ress.response.errors[0]==="You can only access this endpoint when not logged in."){
              this.$router.push('user/dashboard');
            }else{

              this.serverMessage = ress.response.errors[0]
            }
           }
           if(ress.meta.code===200){
            const token =  ress.response.user.authentication_token
            localStorage.setItem('authentication_token',token);
            this.$router.push('user/dashboard');
           }
          
          })



          
        }


       },
}