
export default {
 template:`
 <div class="container">
 <a href="/manager/dashboard" style="text-decoration: none;">&larr; Dashboard</a>

 <h4>Add Product</h4>
 <form action="/Manager/add_product" method="post">
     <div class="form-floating mb-3">
         <input type="text" name="product_name" class="form-control" id="floatingInput" placeholder="Chicken" required>
         <label for="floatingInput">Product Name</label>
     </div>
     <div class="form-floating mb-3">
         <select name="product_unit" class="form-select" id="floatingSelect" aria-label="Floating label select example">
           
           <option value="Kg">Kg</option>
           <option value="Liter">Liter</option>
           <option value="Piece">Piece</option>
         </select>
         <label for="floatingSelect">Select your product's unit</label>
     </div>
     <div class="form-floating mb-3">
         <input type="number" name="product_rate" class="form-control" id="floatingInput" placeholder="Rs" required>
         <label for="floatingInput">Product Rate / Unit in Rupee</label>
     </div>
     <div class="form-floating mb-3">
         <input type="number"  name="product_quantity" class="form-control" id="floatingInput" placeholder="Rs" required>
         <label for="floatingInput">Available Quantity</label>
     </div>
     <div class="form-floating mb-3">
         <input type="date"  name="m_date" class="form-control" id="floatingInput" placeholder="" required>
         <label for="floatingInput">Manufacturing date</label>
     </div>
     <div class="form-floating mb-3">
         <input type="date"  name="e_date" class="form-control" id="floatingInput" placeholder="" required>
         <label for="floatingInput">Expiry date</label>
     </div>
     <input type="number" name="category_id"  value="{{id}}" style="visibility: hidden;display:block">
     <button type="submit" class="btn btn-primary text-center">Create</button>
 </form>
</div>
 
 `
}