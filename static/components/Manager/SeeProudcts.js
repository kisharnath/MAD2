import Nav from "./Nav.js"
import Back from "./Back.js"
export default {
  data: function () {
    return {
      products: [],
      count: 0,
      pId: null,
      pQuantity: null,
      pRate: null,
      editedMessage: ''


    }
  },
  template: `
    <div>
    <Nav />
    <Back />
      <div className="container">
      <h4 class="text-center"></h4>
      
            
      <template v-if="products.length>0">
           <table  class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" class="text-center">#</th>
                  <th scope="col" class="text-center">Product Name</th>
                  <th scope="col" class="text-center">Unit</th>
                  <th scope="col" class="text-center">Rate</th>
                  <th scope="col" class="text-center">Quantity</th>
                  <th scope="col" class="text-center">Manage</th>
                </tr>
              </thead>
              <tbody>
                  
                  
                  <tr v-for='p in products'>
                      <th scope="row" class="text-center">{{count+1}}</th>
                      <td class="text-center">{{p.name}}</td>
                      <td class="text-center">{{p.unit}}</td>
                      <td class="text-center">{{p.rate}}</td>
                      <td class="text-center">{{p.quantity}}</td>
                      <td class="text-center">
                        <button class="btn btn-primary" v-on:click='getForm(p.id,p.quantity,p.rate)' data-bs-toggle="modal" data-bs-target="#m">Click</button>
                      </td>
                      
                  </tr>
                  
                  
              </tbody>
            </table>
        </template>
        <template v-else>
            <h2  class="text-center">No prouduct found</h2>  
        </template>
      
      </div>
  
    
    <!--modal-->
    <div class="modal fade" id="m" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div>
                        Total Orders :30
                      </div>
                      <div>
                        Edit
                        <form  @submit.prevent='submitForm'>
                            <div class="form-floating mb-3">
                                <input type="number" v-model='pRate'   class="form-control" id="floatingInput" placeholder="Rs">
                                <label for="floatingInput">Change Product Rate / Unit in Rupee</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" v-model='pQuantity' class="form-control" id="floatingInput" placeholder="Rs">
                                <label for="floatingInput">Change Quantity</label>
                            </div>
                            <input type="number"   class="form-control" id="floatingInput" style="visibility:hidden;">
                            <button  type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                      <button v-on:click='deletePdouct'  class="btn btn-primary mt-3">Delete</button>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    <div v-if="editedMessage" class="alert alert-info d-flex my-4 align-items-center alert-dismissible fade show mt-3" role="alert">
                          <div>
                        {{editedMessage}}
                          </div>
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                  </div>
                </div>      
              </div>
    <!--modal-header-->

    </div>


    `,
  methods: {
    getForm(id, q, r) {
      this.pId = id
      this.pQuantity = q
      this.pRate = r
    },
    async submitForm() {
      const data = {
        id: this.pId,
        quantity: this.pQuantity,
        rate: this.pRate
      }
      const apiUrl = 'http://127.0.0.1:5000/edit_proudct'; // Replace with your server endpoint URL

      const response = await fetch(apiUrl, {
        method: 'POST', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
          // Attach the token in the Authorization header
          'Content-Type': 'application/json' // Set the content type if you are sending JSON data
          // Add other headers if needed

        },
        body: JSON.stringify(data)
      })
      const res2 = await response.json();
      this.editedMessage = res2.message
    },
    async deletePdouct() {
      const apiUrl = `http://127.0.0.1:5000/delete_proudct/${this.pId}`; // Replace with your server endpoint URL
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Include the Content-Type header if you are sending JSON payload in the request body
        },
      };
      const response =await fetch(apiUrl, requestOptions)
      const res2 = await response.json();
      this.editedMessage = res2.message
      //getting all the products
      const postDate = {
        id: this.$route.params.id,

      }
      const apiUrl2 = 'http://127.0.0.1:5000/get_all_proudct'; // Replace with your server endpoint URL

      const response2 = await fetch(apiUrl2, {
        method: 'POST', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
          // Attach the token in the Authorization header
          'Content-Type': 'application/json' // Set the content type if you are sending JSON data
          // Add other headers if needed

        },
        body: JSON.stringify(postDate)
      })
      const res22 = await response2.json();
      console.log("res")
      this.products = res22.product
      console.log(this.products)
    }


  },
  beforeCreate() {
    this.$nextTick(async function () {
      // fetching data from server for products
      const postDate = {
        id: this.$route.params.id,

      }
      const apiUrl = 'http://127.0.0.1:5000/get_all_proudct'; // Replace with your server endpoint URL

      const response = await fetch(apiUrl, {
        method: 'POST', // Replace with the appropriate HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
          // Attach the token in the Authorization header
          'Content-Type': 'application/json' // Set the content type if you are sending JSON data
          // Add other headers if needed

        },
        body: JSON.stringify(postDate)
      })
      const res2 = await response.json();
      console.log("res")
      this.products = res2.product
      console.log(this.products)
    })
  },
  components: {
    Back
  }
}