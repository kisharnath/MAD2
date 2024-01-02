export default {
    props: ["id","name",'unit',"rate","quantity"],
    data:function(){
      return{
        selectedQuantity:1,
      }
    },
    template: `
    <div class="card" >
        <div class="card-body">               
                <h5 class="card-title">{{name}}</h5>
                <p class="card-text">Rate: &#x20B9;{{rate}} / per {{unit}}  </p>
                <div class='text-center'>
                    <p >Select quantity {{quantity}}</p>
                    <input type="number" v-model='selectedQuantity' class="form-control" />
                    
                    <button v-if='quantity>0' class="btn btn-primary mt-3" v-on:click='addToCart(selectedQuantity)'>Add to cart</button>
                    
                    <p v-else class='mt-3' v-bind:style="{color:'red'}">
                        Product out of stock
                    </p>
                </div>   
        </div>
    </div>

    `,
    methods:{
        async addToCart(q){

            if(q > this.quantity){
                this.$emit('set-message', "You can't select more than " + this.quantity );
            }
            else{
                    const data ={
                    id : this.id,
                    quantity : q
                            }
                const res = await fetch('http://127.0.0.1:5000/add_to_cart',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},body: JSON.stringify(data),
            })
            const res2 = await res.json()
            this.$emit('set-message', "Successfully added to cart " );
            }
            
           
           

        },
        
    }
}