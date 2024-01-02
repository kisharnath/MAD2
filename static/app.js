import Login from './components/Login/Login.js'
import Nav from './components/Login/Nav.js'
import Manager from './components/Login/Manager.js'
import Admin from './components/Login/Admin.js'
import UserLogin from './components/Login/UserLogin.js'
import UserSignup from './components/Login/UserSignup.js'
import ManagerLogin from './components/Login/ManagerLogin.js'
import ManagerSignup from './components/Login/ManagerSignup.js'
import UserDashboard from './components/User/UserDashboard.js'
import AdminDashboard from './components/Admin/AdminDashboard.js'
import AdminBase from './components/Admin/AdminBase.js'
import CreateCategory from './components/Admin/CreateCategory.js'
import EditCategory from './components/Admin/EditCategory.js'
import ManagerBase from './components/Manager/ManagerBase.js'
import ManagerDashboard from './components/Manager/ManagerDashboard.js'
import SeeProudcts from './components/Manager/SeeProudcts.js'
import UserBase from './components/User/UserBase.js'
import Cart from './components/User/Cart.js'
import Orders from './components/User/Orders.js'
import Search from './components/User/Search.js'
import UserTest from './components/User/UserTest.js'
import Request from './components/Admin/Request.js'
import ManagerSignupR from './components/Admin/ManagerSignupR.js'
// import UserDashboard from './components/User/UserDashboard.js'
const router = new VueRouter({
  routes:[
    
    {path: '/', component:Login,
    children:[
      {path:'',component:UserLogin},
      {path:'/Signup',component:UserSignup}
    ]
  },
    {path:'/Login/Manager' , component: Manager,
    children:[
      {path:'',component:ManagerLogin},
      {path:'Signup',component:ManagerSignup}
    ]
  },
    {path:'/Login/Admin' , component: Admin},
    {path:'/user/dashboard',component:UserBase,
   children:[
     {path:'',component:UserTest},
     {path:'cart',name:'Cart',component:Cart},
     {path:'orders',name:'Orders',component:Orders},
     {path:'search',name:'Search',component:Search},
     {path:'userdetails',name:'UserDetails',component:UserDashboard},
    ]
    
    },
    {path:'/admin/dashboard',component:AdminBase,
    children:[
      {path:'',component:AdminDashboard},
      {path:'createCategory',component:CreateCategory},
      {path:'editCategory/:id',name:"EditCategory",component:EditCategory},
      {path:'requests',component:Request},
      {path:'ManagerRequest',component:ManagerSignupR},
      {path:'seeproducts/:id',name:'SeeProductsByAdmin',component:SeeProudcts},
      

       ]
  },
  {path:'/manager/dashboard',component:ManagerBase,
 children:[
  {path:'',component:ManagerDashboard},
  {path:'seeproducts/:id',name:'SeeProducts',component:SeeProudcts},
 ]

}
    
  ]
})
new Vue({
    el: '#app',
    data:{m:"test"},
    template: `<div>
    <router-view></router-view>
           

       </div>`,
    components:{
      Login,
      
    },
    router
    
  })