import Nav from "./Nav.js"
export default {
    data:function(){
        return{

            user_id:null,
            email:'',
            password:'',
            categories:[],
            serverMessage:'',
            isAdmin:false,
            isManager:false,
            
        }
    },
    template:`
    <div class="container">
      <h2 class='text-center'>Categories</h2>
        <div class='row'>

            <div  v-for="item in categories" class="col-md-6 mt-4 text-center">
                    
                   
                <div class="card" style="width:28rem;">
                    <div class="card-body">
                        <h5 class="card-title">{{item.name}}</h5>
                        <div  style="margin-top:50px">
                        
                        <button v-on:click="deleteCat(item.category_id)" class='btn btn-primary'>Delete</button>
                        <router-link :to="{ name: 'SeeProductsByAdmin', params:{ id:item.category_id } }" class="btn btn-primary">Products</router-link>
                        <router-link :to="{ name: 'EditCategory', params:{ id:item.category_id } }" class="btn btn-primary">Edit</router-link>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
            <div>
           {{this.serverMessage}}ss
           
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>   
    </div>
    `,
    components:{
        Nav
    },
   
    methods:{
        
            deleteCat: async function(id){
                   const res = await fetch(`http://127.0.0.1:5000/delete_categories/${id}`,{method:'GET'} )
                   const res2  = await res.json()  
                   
                   this.serverMessage=res2.message
                   // get the category
                   const apiUrl2 = 'http://127.0.0.1:5000/get_categories'; // Replace with your server endpoint URL

            const response2 =await fetch(apiUrl2, {
                method: 'GET', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
                headers: {
                     // Attach the token in the Authorization header
                    'Content-Type': 'application/json' // Set the content type if you are sending JSON data
                    // Add other headers if needed
                }
                })
            const data2 = await response2.json()
            this.categories = data2.success
                   
            }
            
            
    },
    beforeCreate() {
        this.$nextTick(async function () {

            const token = localStorage.getItem('authentication_token');
            const apiUrl = 'http://127.0.0.1:5000/profile'; // Replace with your server endpoint URL

            const response =await fetch(apiUrl, {
                method: 'GET', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
                    'Content-Type': 'application/json' // Set the content type if you are sending JSON data
                    // Add other headers if needed
                }
                })
            const data = await response.json()
            this.user_id = data.id
            this.email =data.email
            this.password = data.password
            this.roles = data.roles
              const allrole = this.roles
              console.log(data)
              if (allrole.includes('admin')){
                 this.isAdmin= true
                 
              }
              if (allrole.includes('manager')){
                this.isManager= true
                
             }
            // getting categories
            const apiUrl2 = 'http://127.0.0.1:5000/get_categories'; // Replace with your server endpoint URL

            const response2 =await fetch(apiUrl2, {
                method: 'GET', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
                headers: {
                     // Attach the token in the Authorization header
                    'Content-Type': 'application/json' // Set the content type if you are sending JSON data
                    // Add other headers if needed
                }
                })
            const data2 = await response2.json()
            this.categories = data2.success
            

          })
    },
}