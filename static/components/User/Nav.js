export default {
  data:function(){
    return{
      styleButton:{
        border:"none",
        backgroundColor:"white",
        marginLeft:"5px"
      },
     
    }
  },
    template:`
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
              <a class="navbar-brand" href="#"> <b>GroceryStoreApp</b>   </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">              
                </ul>
                <li class="nav-item dropdown d-flex" style="margin-right: 100px;">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Login
                  </a>
                  <ul class="dropdown-menu" >
                    <li> <router-link to='/user/dashboard/userdetails' class="dropdown-item">Account</router-link></li>
                    <li> <router-link to='/user/dashboard/orders' class="dropdown-item">Your Orders</router-link></li> <li><hr class="dropdown-divider"></li>
                    <li><router-link to="/user/dashboard/cart" class="dropdown-item">Cart</router-link></li> 
                    <li><button v-on:click="logout" v-bind:style="styleButton">Logout</button></li>                            
                  </ul>
                </li>
              </div>
            </div>
          </nav>
    
    `,
    methods:{
      logout:function(){
        const postData={
          email:this.email,
          password:this.password
        }
        fetch("http://127.0.0.1:5000/logout",{
        method: "POST", // Use the POST method
            headers: {
              "Content-Type": "application/json", // Specify the content type as JSON
            },
            body: JSON.stringify(postData)
          }
        )
        .then((res)=>{
          return res.json();
        }).then(ress=>{
          if(ress.meta.code===200){
            console.log("Success")
            this.$router.push('/');
          }
        })
      }
    },
   
}