console.log(1)
export default {
    data:function (){
        return{
            firstName :'',
            lastName :'',
            email :'',
            password :'',
            serverMessage :'',
        }
    },
    template:`
    <div>
     <h1 class="text-center">Manager Registration</h1>
     <form @submit.prevent="submitForm"  class="text-center" style="margin:35px 150px">
         <div class="input-group mb-3">
             <span class="input-group-text">First and last name</span>
             <input type="text" v-model="firstName" aria-label="First name" class="form-control" required>
             <input type="text" v-model="lastName" aria-label="Last name" class="form-control" required>
           </div>
         <div class="input-group mb-3 " >
             <span class="input-group-text" id="basic-addon1">@</span>
             <input type="email"  v-model="email" class="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1"  required><br/>
             
         </div>
         <div class="input-group mb-3 " >
             <span class="input-group-text" id="basic-addon1">@</span>
             <input type="password" v-model="password" class="form-control" placeholder="Password" aria-label="Username" aria-describedby="basic-addon1" required>
         </div>
     
         <button class="btn btn-primary " >Register</button>
         Already have an account <router-link to='/Login/Manager'>Login</router-link>
    
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
   
     submitForm:async function (){
      const postDate ={
        first_name :this.firstName,
        last_name :this.lastName,
        email :this.email,
        password:this.password
    }
      const requestOptions = {
        method: "POST", // Use the POST method
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(postDate), // Convert the data to JSON format
      };
      
      const res = await fetch('http://127.0.0.1:5000/request_for_signup_manager',requestOptions)
      const res2 = await res.json() 
      this.serverMessage =res2.message
      
    }
   },
}