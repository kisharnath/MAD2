import Nav from "./Nav.js"
import Back from '../Manager/Back.js'
import Card from "./Card.js"
export default {
    data: function () {
        return {

           userDetails :{}
            
            
            
        }
    },
    template: `
    <div>
    <Back />
        
        <div  class="container mt-5">
            
            <h3></h3>
            <div class="row">
             <div class="col-3"></div>
             <div class="col-6">
                    <p><b> First Name </b> : {{userDetails["first_name"]}}</p>
                    <p><b> Last Name </b> : {{userDetails["last_name"]}}</p>
                    <p><b> Email </b> : {{userDetails["email"]}}</p>
                    
                    <p><b> Total orders </b> : {{userDetails["total_orders"]}}</p>
                    
                    

             
             </div>
             <div class="col-3"></div>
            </div>
            
        </div>

    </div>
    
    `,
    components:{
        Back
    },
    methods:{

        
    },
    beforeCreate() {
        this.$nextTick(function () {

            const token = localStorage.getItem('authentication_token');
            const apiUrl = 'http://127.0.0.1:5000/profile'; // Replace with your server endpoint URL

            fetch(apiUrl, {
                method: 'GET', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
                    'Content-Type': 'application/json' // Set the content type if you are sending JSON data
                    // Add other headers if needed
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the response data from the server
                   this.userDetails = data
                   console.log(this.userDetails);
                })
                .catch(error => {
                    // Handle errors if any
                    console.error('Error:', error);
                });



        })
    },
    
}