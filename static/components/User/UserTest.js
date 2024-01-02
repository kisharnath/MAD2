import Nav from "./Nav.js"
import Card from "./Card.js"
import Byname from "./search/Byname.js"
export default {
    data: function () {
        return {

            anothercatAndPro:[],
            user_id: null,
            email: '',
            password: '',
            catAndPro: [],
            serverMessage:'',
            search:'',
            searchPro: '',
            
            
            
        }
    },
    template: `
    <div class='mt-4 container '>
    
      <input v-model="search" class='form-control text-center' placeholder='Search by category name'>
        <div v-if='serverMessage' class="container alert alert-primary mt-4" role="alert">
        {{serverMessage}}
        </div>
        <div v-for="(categories,index) in Query" class="container mt-5">
            
            <h3>{{categories.category_name}} </h3> 
            <div class="row">
            <!--search --->
            <div class="row mb-3">
                <div class="col-4">
                  <Byname
                   v-bind:index='index'
                    v-bind:products='Query' 
                    v-bind:methodName='"searchByName"'
                    v-on:search-products='searchProduct'
                    v-bind:producstAll='anothercatAndPro[index].prouducts'
                    
                    />
                </div>
                <div class="col-4">
                
                </div>
                <div class="col-4">
                     <Byname 
                        v-bind:index='index'
                        v-bind:products='Query' 
                        v-bind:methodName='"searchByDate"'
                        v-on:search-products='searchProduct'
                        
                        />
                        
                </div>
            </div>
            <!--search --->
               <div class="row" v-if="categories.prouducts.length>0">
             
                 
                        <div v-for="product in categories.prouducts" class="col-md-3 ">
                            <Card v-bind:id='product.product_id' v-bind:name='product.product_name'
                            v-bind:rate='product.rate_per_unit'
                            v-bind:unit='product.unit'
                            v-bind:quantity='product.quantity'
                            v-on:set-message='setMessage'
                            />
                        </div>
                </div>
                <div v-else>
                       No product found
                </div>
            </div>
            
        </div>
        <button v-on:click='restorAll()' class="btn btn-primary btn-fixed" style="position: fixed;bottom: 20px;right: 20px;">Restore</button>
                 

    </div>
    
    `,
    components:{
        Card,
        Byname
    },
    methods:{
        
        setMessage(message){
            this.serverMessage = message
            setInterval(()=>{
                this.serverMessage = ''
            }, 4000);
        },
       async restorAll(){
            const res = await fetch('http://127.0.0.1:5000/get_products_category_user', { method: 'GET' })
            const res2 = await res.json();
            this.catAndPro = res2.catePro
            this.anothercatAndPro =res2.catePro
        },
         async searchProduct(index,searchPro,methodName){
            //get product once again
            const res = await fetch('http://127.0.0.1:5000/get_products_category_user', { method: 'GET' })
            const res2 = await res.json();
            this.catAndPro = res2.catePro
            this.anothercatAndPro =res2.catePro
            if (searchPro) {
                if (methodName==='searchByName'){
                this.Query[index].prouducts= this.Query[index].prouducts.filter(item => {
                  return searchPro
                    .toLowerCase()
                    .split(" ")
                    .every(v => item.product_name.toLowerCase().includes(v) 
                    
                    
                    );
                });
                }
                //search by date
                if (methodName==='searchByDate'){
                    this.Query[index].prouducts= this.Query[index].prouducts.filter(item => {
                      return searchPro
                        .split(" ")
                        .every(v => item.m_date.includes(v)              
                        );
                    });
                    }

              } 
           
             
        },
        
        
    },
    computed: {
        Query() {
          if (this.search) {
            return this.catAndPro.filter(item => {
              return this.search
                .toLowerCase()
                .split(" ")
                .every(v => item.category_name.toLowerCase().includes(v) 
                
                
                );
            });
          } else {
            return this.catAndPro;
          }
        }
      },
    beforeCreate() {
        this.$nextTick(async function () {

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
                .then( data => {
                    // Handle the response data from the server
                    this.user_id = data.id
                    this.email = data.email
                    this.password = data.password
                    
                })
                .catch(error => {
                    // Handle errors if any
                    this.$router.push('/');
                    console.error('Error:', error);
                });

             

        })
    },
    async mounted() {
        const res = await fetch('http://127.0.0.1:5000/get_products_category_user', { method: 'GET' })
        const res2 = await res.json();
        this.catAndPro = res2.catePro
        this.anothercatAndPro =res2.catePro
        
        
    },
}