import Nav from "./Nav.js"
export default {
    data:function(){
     return {
            email : 'k@gmail.com',
            password : 'k',
            serverMessage : '',
            loggedin:false,
            roles :[],
            userexist:false
     }
    },

    template:`
    <div>
        
        <div class="container mt-3">
        
        <h3 class="text-center">Manager Login</h3>

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
                        Don't have account? <router-link to='/Login/Manager/Signup'>Create</router-link>  
                        <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                        <div>
                            {{this.serverMessage}}
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                    </div>
                </form>
                
        </div>
    </div>
    
    `,
    components:{
        Nav
    },
    methods:{
        submitForm:function () {

    
        

            const postData ={
                email : this.email,
                password : this.password

            }
            const requestOptions = {
                method: "POST", // Use the POST method
                headers: {
                  "Content-Type": "application/json", // Specify the content type as JSON
                },
                body: JSON.stringify(postData), // Convert the data to JSON format
              };
             //login fetch

            
              //login?include_auth_token
          fetch('http://127.0.0.1:5000/login?include_auth_token',requestOptions).then((res)=>{return res.json()}).then(ress=>{
          console.log(ress)  
          if(ress.meta.code===400){
            console.log(ress.meta.code)
            if(ress.response.errors[0]==="You can only access this endpoint when not logged in."){
                this.loggedin = true
                const token = localStorage.getItem('authentication_token');
                
                 this.profileChecked(token)
                
            }else{

              this.serverMessage = ress.response.errors[0]
            }
           }
           if(ress.meta.code===200){
            const token =  ress.response.user.authentication_token
            localStorage.setItem('authentication_token',token);
            this.userexist = true
            
            this.profileChecked(token)


            
           }
          
          })

          
            
        },
        profileChecked: function(token){
            
                /// check if the user is admin or not
               
                   
                   const apiUrl = 'http://127.0.0.1:5000/profile'; // Replace with your server endpoint URL
            
                   fetch(apiUrl, {
                   method: 'GET', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
                   headers: {
                       'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
                       'Content-Type': 'application/json' // Set the content type if you are sending JSON data
                       // Add other headers if needed
                   }
                   })
                   .then(response => {
                   if (!response.ok) {
                       throw new Error('Network response was not ok.');
                   }
                   return response.json();
                   })
                   .then(data => {
                   // Handle the response data from the server
                    //  console.log(data.roles)
                    this.roles = data.roles
                     console.log(this.roles)
                     const adminCheck = this.roles.includes('manager')
                       if (this.loggedin && adminCheck){
                           console.log('you are logged in')
                            this.$router.push('/manager/dashboard');
            
                       }
                       if(adminCheck && this.userexist){
                        console.log("you are")
                            this.$router.push('/manager/dashboard');
                       }
                   })
                   .catch(error => {
                   // Handle errors if any
                   console.error('Error:', error);
                   });
            
                    
        }

        

    }
}