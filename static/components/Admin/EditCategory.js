export default {
    data : function(){
        return {
            styleButton :{
                backgroundColor :"white",
                border:'none'
            },
            
            categoryName:'',
            serverMessage:'',
            id:null,
            isManager:false,
            isAdmin:false,
            
        }
    },
    template:`
    <div class="container text-center">
            <button v-bind:style="styleButton" @click="goToPreviousRoute">&larr;Go Back</button>
            <h1 className="text-center">Edit Category</h1>
            <form @submit.prevent="EditCategory" style="margin:35px 150px"  class="mt-4">
                <input type="text" v-model="categoryName" class="form-control" id="" placeholder="Category Name">
                <button v-if='isManager==false'  class="btn btn-primary mt-2" type="submit">Edit for Admin</button>
                


                <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                    <div>
                {{this.serverMessage}} 
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                </form>
                
                <button v-if='isManager==true&&isAdmin==false' v-on:click='Request()' class="btn btn-primary">Request</button>
                <p>If your request is approved it will be edited if not request will be sent to admin</p>
        </div>   
    
    `,
    methods:{
        goToPreviousRoute() {
            // Use the router.go() method to go back to the previous route
            this.$router.go(-1);
          },
          async Request(){
            const apiUrl = 'http://127.0.0.1:5000/manager_request'
            const postDate ={
              id : this.$route.params.id,
              category_name:this.categoryName,
              action:'edit'
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

          }
          ,
          EditCategory:async function(){
            console.log(this.$route.params.id)
            const postDate ={
                id :this.$route.params.id,
                name : this.categoryName,
                
                }
                  const requestOptions = {
                    method: "PUT", // Use the POST method
                    headers: {
                      "Content-Type": "application/json", // Specify the content type as JSON
                    },
                    body: JSON.stringify(postDate), // Convert the data to JSON format
                  };
                  

                    const res = await fetch("http://127.0.0.1:5000/edit_categories",requestOptions)
                    const res2 = await res.json()
                    console.log(res2)
                    this.serverMessage = res2.message
                    if (res2.response.errors[0]){
                        this.isManager = true
                        this.serverMessage = 'You are not admin get permission from admin to edit this'
                    }
                  
                   
                  }
    },
    computed: {
        userId() {
          return this.$route.params.id;
        },
      },
      created() {
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
                   const r= data.roles
                    // Handle the response data from the server
                   
                  if(r.includes('manager')){
                    this.isManager = true
                  }
                })
                .catch(error => {
                    // Handle errors if any
                    console.error('Error:', error);
                });



        })
    },
}