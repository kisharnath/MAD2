import Nav from "./Nav.js"
export default {
    template:`
    <div>
      <Nav />
      <router-view></router-view>
      <router-link to="/admin/dashboard/createCategory" class="btn btn-primary btn-fixed" style="position: fixed;bottom: 20px;right: 20px;">Create category</router-link>          

    </div>
    
    
    `,
    components:{
      Nav
    }
}