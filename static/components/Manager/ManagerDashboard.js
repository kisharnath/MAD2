import Nav from "./Nav.js"
export default {
    data:function(){
        return{
            options: [
                { value: 'Kg', label: 'Kg' },
                { value: 'Piece', label: 'Piece' },
                { value: 'Liter', label: 'Liter' },
                // Add more options as needed
              ],
            user_id:null,
            email:'',
            password:'',
            categories:[],
            serverMessage:'',
            addProductMessage:'',
            pName:'',
            pUnit:'',
            pRate:'',
            pQuantity:'',
            pMDate:null,
            pEDate:null,
            productCreateMessage:'',
            deletedId :null,
            toShowDeletedButton:true,
            toShowDeletedButton2:false,
            deletedMessage :false

            
        }
    },
    template:`
    <div class="container">
    <button v-if='toShowDeletedButton2' v-on:click='deletedByManger()' class="btn btn-primary btn-fixed" style="position: fixed;bottom: 20px;right:200px;">Delete</button>
    <button v-on:click='downloadCsv()' class="btn btn-primary btn-fixed" style="position: fixed;bottom: 20px;right:300px;">Download csv</button>

      <h2 class='text-center'>Categories</h2>
        <div class='row'>

            <div  v-for="item in categories" class="col-md-6 mt-4 text-center">  
            
            <!--Modal -->
               <b-modal :id="item.name" hide-footer>
                    <template #modal-title>
                    Add a product 
                    </template>
                    <div class="d-block text-center">
                    
                    <div v-if="productCreateMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                                    <div>
                                    {{productCreateMessage}}
                                    </div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div> 
                      <!--forrm--->
                      <form @submit.prevent="submitForm(item.category_id)" >
                            <div class="form-floating mb-3">
                                <input type="text" v-model='pName' class="form-control" id="floatingInput" placeholder="Chicken" required>
                                <label for="floatingInput">Product Name</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select v-model="pUnit" class="form-select" id="floatingSelect" aria-label="Floating label select example">
                                
                                <option v-for='i in options' v-bind:value="i.value">{{i.label}}</option>
                                
                                </select>
                                <label for="floatingSelect">Select your product's unit</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" v-model="pRate" class="form-control" id="floatingInput" placeholder="Rs" required>
                                <label for="floatingInput">Product Rate / Unit in Rupee</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number"  v-model="pQuantity" class="form-control" id="floatingInput" placeholder="Rs" required>
                                <label for="floatingInput">Available Quantity</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="date"  v-model='pMDate' class="form-control" id="floatingInput" placeholder="" required>
                                <label for="floatingInput">Manufacturing date</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="date"  v-model='pEDate' class="form-control" id="floatingInput" placeholder="" required>
                                <label for="floatingInput">Expiry date</label>
                            </div>
                            
                            <button  class="btn btn-primary text-center">Create</button>
                            
                    </form>
                      <!---form-->


                    </div>
                    <b-button class="mt-3" block @click="$bvModal.hide(item.name)">Close Me</b-button>
                </b-modal> 
                <!--Modal -->
            
                <div class="card" style="width:28rem;">
                    <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <div  style="margin-top:50px">
                        <b-button id="show-btn" v-on:click="$bvModal.show(item.name)">Add Products</b-button>
                        <button v-on:click="deleteCat(item.category_id)" class='btn btn-primary'>Delete</button>
                        <router-link :to="{ name: 'SeeProducts', params:{ id:item.category_id } }" class="btn btn-primary">Products</router-link>
                        <router-link :to="{ name: 'EditCategory', params:{ id:item.category_id } }" class="btn btn-primary">Edit</router-link>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         <div v-if="serverMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
            <div>
           {{this.serverMessage}}
           <button  v-if='toShowDeletedButton===true' class='btn btn-primary' v-on:click='Request' >Send Request</button>

            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>  
        <div v-if="deletedMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
        <div>
                 {{this.deletedMessage}}

        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
         
    </div>
    `,
    components:{
        Nav
    },
   
    methods:{
        downloadCsv(){
            fetch('http://127.0.0.1:5000/csv_file',{method: 'GET'}).then(res=>res.json()).then(res2=>{
                console.log('csv')
                console.log(res2)
                setTimeout(() => {
                    console.log('setitmeout')
                    window.location.href ='http://127.0.0.1:5000/download_file'
                }, 1000);
            })

        },

        async deletedByManger(){
            const apiUrl = 'http://127.0.0.1:5000/category_deleted_by_manager'
            const postDate ={
              id :this.deletedId,

            } 
            const requestOptions = {
              method: "DELETE", // Use the POST method
              headers: {
                "Content-Type": "application/json", // Specify the content type as JSON
              },
              body: JSON.stringify(postDate), // Convert the data to JSON format
            };
            const res =await fetch(apiUrl,requestOptions)
            const res2 = await res.json();
            this.deletedMessage = res2.message
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
        },
        async Request(){
            const apiUrl = 'http://127.0.0.1:5000/manager_request'
            const postDate ={
              id :this.deletedId,
              action:'delete'
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
            this.serverMessage =res2.message;
            this.toShowDeletedButton = false
            console.log(res2.aproved)
            if(res2.aproved){
                 this.toShowDeletedButton2 = true

             }
            setInterval(() => {
                this.toShowDeletedButton = true
                t
            }, 10000);

          },
            deleteCat: async function(id){
                   const res = await fetch(`http://127.0.0.1:5000/delete_categories/${id}`,{method:'GET'} )
                   console.log(res)
                   if (!res.ok){
                    this.serverMessage = 'You are not admin.A request has been sent to admin'
                    this.deletedId = id
                    
                   }
                   else{
                    const res2  = await res.json()  
                    
                    
                    this.serverMessage=res2.message
                   }
                  
                   
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
                   
            },
            submitForm(idCate){
                console.log(idCate)
                const postDate ={
                    id:idCate,
                    p_name:  this.pName,
                    p_unit: this.pUnit,
                    p_rate: this.pRate,
                    p_quantity:this.pQuantity,
                    p_mdate:this.pMDate,
                    p_edate:this.pEDate
              }
              console.log(postDate)
                const requestOptions = {
                  method: "POST", // Use the POST method
                  headers: {
                    "Content-Type": "application/json", // Specify the content type as JSON
                  },
                  body: JSON.stringify(postDate), // Convert the data to JSON format
                };
                
                fetch('http://127.0.0.1:5000/create_product',requestOptions).then((res)=>{return res.json()}).then(ress=>{this.productCreateMessage=ress.message})
              }
            
            
    },
    beforeCreate() {
        this.$nextTick(async function () {
            // console.log(this.productCreateMessage)

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