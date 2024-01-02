import Nav from "./Nav.js"
import Back from "../Manager/Back.js"
export default {
    template:`
    <div class="container " >
    <Back />
    <h3 class="text">Manager signup request</h3>
         <table class="table" v-if='request!==[]'>
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col"> Email</th>
                        <th scope="col">Click</th>
                        
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for='(o,index ) in request'>
                        <th scope="row">{{count+index}}</th>
                        <td>{{o.email}}</td>
                        <button class="btn btn-primary" v-on:click="ApproveMangerSignup(o.id)">Approve</button>
                        
                        </td>
                        
                     </tr>
                  
                     
                  </tbody>
                  
         </table>
    
    </div>
    
    
    
    `,
    components:{
      Nav,
      Back
    },
    data:function(){
        return{
            request :[],
            count:1
        }
    },
    methods:{
        async getRequest(){
                const res = await fetch('http://127.0.0.1:5000/get_manager_signup_request',{method: 'GET'});
                const res2 = await res.json();
                this.request = res2
                console.log(this.request)

        },
        async ApproveMangerSignup(id){
            const res = await fetch('http://127.0.0.1:5000/approve_manger_signup',{
            
            method: "POST", // Use the POST method
            headers: {
              "Content-Type": "application/json", // Specify the content type as JSON
            },
            body: JSON.stringify({id:id})
             } );
            const res2 = await res.json();
            console.log(res2.message)
            this.getRequest()
        }
    },
    created() {
        this.getRequest()
    },

}