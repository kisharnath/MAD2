import Back from "../Manager/Back.js"
export default {
    data:function(){
        return {
            allOrders :[],
            grandTotal:null,
            count:0
        }
    },
    template:`
    <div class="container " v-if='allOrders!==[]'>
    <Back />
    <h3 class="text">Orders</h3>
         <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Total Price</th>

                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for='(o,index ) in allOrders'>
                        <th scope="row">{{count+index}}</th>
                        <td>{{o.name}}</td>
                        <td>{{o.price}}</td>
                        <td>{{o.purchased_quanity}}</td>
                        <td>{{o.date.substring(5, 16)}}</td>
                        <td>{{o.purchased_quanity*o.price}}</td>
                     </tr>
                  
                     <tr>
                        <th scope="row">Total</th>
                        <td colspan="4"></td>
                        <td>{{grandTotal}}</td>
                     </tr>
                  </tbody>
                  
         </table>
    
    </div>
    
    
    
    `,
    components:{
        Back
    },
    async beforeCreate() {
        const res = await fetch(`http://127.0.0.1:5000/get_orders`,{method: 'GET'}) 
        const res2 = await res.json()
        if(res2.status ==='true'){this.allOrders = res2.orders}
        
        
        for (let index = 0; index < res2.orders.length; index++) {
          const element = res2.orders[index].purchased_quanity * res2.orders[index].price;
          this.grandTotal += element 
        }
    },
}