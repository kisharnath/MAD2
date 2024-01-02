export default {
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
                    <li> <router-link to='/Login/Manager' class="dropdown-item">Manager</router-link></li>
                    <li> <router-link to='/Login/Admin' class="dropdown-item">Admin</router-link></li>
                    <li> <router-link to='/' class="dropdown-item">User</router-link></li>                    <li><hr class="dropdown-divider"></li>
                    <li><router-link to='/Signup' class="dropdown-item">User Signup</router-link></li> 
                    <li><router-link to='/Login/Manager/Signup' class="dropdown-item">Signup for Manager</router-link></li>                            
                  </ul>
                </li>
              </div>
            </div>
          </nav>
          
    
    
    `,
   
}