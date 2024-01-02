export default {
    data : function(){
        return {
            styleButton :{
                backgroundColor :"white",
                border:'none'
            },
            user_id :'',
            email :'',
            password:'' ,
            roles:[] ,
            categoryName:'',
            isAdmin:false,
            serverMessage:"",
            isManager:false
        }
    },
    template :`
    <div>
    
        <div class="container text-center">
            <button v-bind:style="styleButton" @click="goToPreviousRoute">&larr;Go Back</button>
            <form @submit.prevent="CreateCategory" style="margin:35px 150px"  class="mt-4">
                <input type="text" v-model="categoryName" class="form-control" id="" placeholder="Category Name">
                <button v-if='isManager==false&&isAdmin==true'  class="btn btn-primary mt-2" type="submit">Create</button>
                <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                    <div>
                {{this.serverMessage}}
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </form>
            <button v-if='isManager==true&&isAdmin==false' v-on:click='Request()' class="btn btn-primary">Request</button>
            <p>If your request is approved it will be created if not request will be sent to admin</p>
            
            
        </div>
    
    </div>
    
    
    `,
    methods: {
        async Request(){
            const apiUrl = 'http://127.0.0.1:5000/manager_request'
            const postDate ={
              category_name : this.categoryName,
              action:'create'
            } 
            const requestOptions = {
              method: "POST", // Use the POST method
              headers: {
                "Content-Type": "application/json", // Specify the content type as JSON
              },
              body: JSON.stringify(postDate), // Convert the data to JSON format
            };
            const res =await fetch(apiUrl,requestOptions)
            const res2 = await res.json();
            this.serverMessage = res2.message

          },
        goToPreviousRoute() {
          // Use the router.go() method to go back to the previous route
          this.$router.go(-1);
        },
        CreateCategory:function(){
            
            if(this.isAdmin ===false){
                console.log("you are not admin")
                this.serverMessage='Your are not admin'
                return
            }
            const postDate ={
            category : this.categoryName
            }
              const requestOptions = {
                method: "POST", // Use the POST method
                headers: {
                  "Content-Type": "application/json", // Specify the content type as JSON
                },
                body: JSON.stringify(postDate), // Convert the data to JSON format
              };
              
              fetch('http://127.0.0.1:5000/create_category',requestOptions).
              then((res)=>{return res.json()}).
              then(ress=>{
                
                this.serverMessage=ress.message
                console.log(ress.message)
            })
      },


      
    },
beforeCreate() {
    this.$nextTick(function () {

        const token = localStorage.getItem('authentication_token');
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
            console.log(data);
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
            })
            .catch(error => {
            // Handle errors if any
            console.error('Error:', error);
            });



      })
},

}