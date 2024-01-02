export default {
    data : function(){
        return {
            styleButton :{
                backgroundColor :"white",
                border:'none'
            } 
        }
    },
    template:`
    
    <button class='text-center' v-bind:style="styleButton" @click="goToPreviousRoute">&larr;Go Back</button>
    `,
    methods: {
        goToPreviousRoute() {
          // Use the router.go() method to go back to the previous route
          this.$router.go(-1);
        },}
}