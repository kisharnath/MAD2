import Back from "../Manager/Back.js"

export default {
   data :function(){
      return{
         count:1,
         products :[],
         grandTotal:null,
         productIds:[],
         serverMessage:''
      }
   },

 template:`
 <div class='text-center mt-4 container'>
 <Back />
 <div v-if='products.length > 0'>
  <h3 class="text">Cart</h3>
         <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Decrease Quantity</th>
                        <th scope="col">Increase Quantity</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Total Price</th>

                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for='(p,index ) in products'>
                        <th scope="row">{{count+index}}</th>
                        <td>{{p.product_name}}</td>
                        <td>{{p.rate}}</td>
                        <td>{{productIds[index].quantity}}</td>
                        <td><button v-if='productIds[index].quantity-1!==0' class="btn btn-primary" v-on:click='Decrease(index)'>-</button></td>
                        <td><button class="btn btn-primary" v-on:click='Increase(index)'>+</button></td>
                        <td><button class="btn btn-primary" v-on:click='Delete(index)'>Click</button></td>
                        <td>{{p.quantity*p.rate}}</td>
                     </tr>
                  
                     <tr>
                        <th scope="row">Total</th>
                        <td colspan="6"></td>
                        <td>{{grandTotal}}</td>
                     </tr>
                  </tbody>
                  
         </table>
         <div v-if='serverMessage' class="container alert alert-primary mt-4" role="alert">
                     {{serverMessage}}
                  </div>
   <button v-on:click='Buy' class="btn btn-primary">Place Cart</button>

  </div> 
  <div v-else>No product </div>
 </div>
 
 `,
 components:{
   Back
 },
 methods: {
   async Buy(){
      console.log(this.productIds)
     const res = await fetch('http://127.0.0.1:5000/buy_products',
     {method: 'POST',headers:{'Content-Type': 'application/json'},body: JSON.stringify({ids:this.productIds})}
     
     )
     const res2 = await res.json()
     this.serverMessage = res2.message
      setInterval(()=>{
               this.serverMessage = ''
         }, 4000);

      // getting all the cart once again
      this.products=[]
      this.grandTotal = null
   
            
   },
   Increase(index){
      this.productIds[index].quantity += 1
      this.grandTotal += this.products[index].rate

   },
   Decrease(index){
      // console.log(this.productIds[index].quantity)
      this.productIds[index].quantity -= 1
      this.grandTotal -= this.products[index].rate

   },
   Delete(index){
      this.products.splice(index, 1);
   }
 },
 async beforeCreate() {
    const res = await fetch(`http://127.0.0.1:5000/get_cart`,{method: 'GET'}) 
    const res2 = await res.json()
    this.products = res2
    
    for (let index = 0; index < res2.length; index++) {
      const element = res2[index].quantity * res2[index].rate;
      this.grandTotal += element

      this.productIds.push({"id":res2[index].prouduct_id,"quantity":res2[index].quantity,"rate":res2[index].rate})
      
    }
  
 },
}