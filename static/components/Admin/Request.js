import Nav from "./Nav.js"
import Back from "../Manager/Back.js"
export default {
    template:`
    <div class="container " v-if='request!==[]'>
    <Back />
    <h3 class="text">Orders</h3>
         <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col">Manager Email</th>
                        <th scope="col">Category Name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                        <th scope="col">Click</th>
                        
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for='(o,index ) in request'>
                        <th scope="row">{{count+index}}</th>
                        <td>{{o.manager_email}}</td>
                        <td>{{o.cat_name}}</td>
                        <td> <p v-if='o.status!==true'>Not approved</p> <p v-else>Approved</p>  </td>
                        <td>{{o.action}}</td>
                        <td>
                        <button v-if='o.status!==true' class="btn btn-primary w-25" v-on:click="Approve(o.id)">Aprove</button>
                        <button v-else class="btn btn-primary" v-on:click="Approve(o.id)">Disapprove</button>
                        
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
                const res = await fetch('http://127.0.0.1:5000/request',{method: 'GET'});
                const res2 = await res.json();
                this.request = res2
                console.log(this.request)

        },
        async Approve(id){
            const res = await fetch('http://127.0.0.1:5000/aprpove_disprove',{
            
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