export default {
    props:['index','products','methodName'],
    data:function(){

      return {
        searchName:''
      }
    },
    template:`
    <div class="row mb-3">
              
              <div class="col-9">
                <input v-if="methodName=='searchByName'" v-model='searchName' type='text'  class='form-control ' placeholder='Search by product name'>
                <input v-if="methodName=='searchByDate'" v-model='searchName' type='date'  class='form-control ' placeholder='Search by product name'>

                </div>
              <div class="col-2">
                <button class="btn btn-primary" v-on:click="searchByName(index)" >Search</button>
              </div>
              <div class="col-1">
             
              </div>
            </div>
            <!--search --->
    `,
    methods:{
        searchByName(index){
        
          this.$emit('search-products', index,this.searchName,this.methodName);
        }
    }

}