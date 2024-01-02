from flask import Flask,render_template,request, jsonify,send_file
from flask_login import current_user
from flask_security import Security, SQLAlchemyUserDatastore,auth_required,roles_required,roles_accepted
from config import DevelopmentConfig
from models.models import *
from flask_migrate import Migrate
from datetime import datetime
from marshmallow import Schema, fields

#----for messsaging------------------------



# ---------------Celery imports --------------------------------
from worker import create_celery_app
import tasks
from tasks import mail 
from celery.result import AsyncResult
from celery.schedules import crontab

datastore = SQLAlchemyUserDatastore(db, User, Role)
app = Flask(__name__)

#-----Mail configuration --------------------------------
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'kisharnat@gmail.com'
app.config['MAIL_PASSWORD'] = 'tcmsetllztmujkvs'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


# Celery and redis
cel_app = create_celery_app(app)
app.config.from_object(DevelopmentConfig)
db.init_app(app)
security = Security(app,datastore)
migrate = Migrate(app, db)
migrate.init_app(app, db, render_as_batch=True)
mail.init_app(app)
app.app_context().push()
# Setup Flask-Security

#periodic task
# sending email every day
@cel_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(20.0, tasks.send.s(), name='add every 10')

    # Every minute  
    sender.add_periodic_task(
        crontab(minute=0,hour=15),
        tasks.send.s()
    )
    

# sending mail every month first day
@cel_app.on_after_configure.connect
def setup_periodic_tasks2(sender, **kwargs):
    # sender.add_periodic_task(20.0, tasks.send.s(), name='add every 10')
    # Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        crontab(minute=0, hour=0, day_of_month='7'),
        tasks.send_report.s()
    )
   

# export csv file
@app.get('/csv_file')
@roles_required('manager')
def csv_file():
    user = current_user
    print('csv file')
    s = tasks.get_csv_file.delay(user.id)
    return jsonify(
        {
            "Task ID ":s.id,
            'Task_state':s.state,
            'Task_result':s.result
        }
    )
@app.get('/download_file')
def download_file():
    return send_file("./data.csv")


# all the apis --------------------------
@app.route('/')
def home():
    return render_template('index.html')
#creating user
@app.post('/api/create/user')
def create_user():
    request_data = request.get_json()
    email = request_data['email']
    user_exit = datastore.find_user(email=email)
    if user_exit:
        # role = datastore.create_role(name='manager', description='Manager role')
        # datastore.add_role_to_user(user_exit, role)
        # db.session.commit()
        return jsonify({"message":'Email already exists'})
    else:
        datastore.create_user(**request_data)
        db.session.commit()
        insert = datastore.find_user(email=email)
      
        user_role = db.session.get(Role,3)
       
        insert.roles.append(user_role)
        db.session.commit()
        return jsonify({"message": "Successfully created"})

#getting profile details
@auth_required('token')
@app.get('/profile')
def profile():
    
    user = current_user
    id =user.id
    email=user.email
    password=user.password
    user_roles =[]
    for role in user.roles:
        user_roles.append(role.name)
    print(user.roles)
    return jsonify(
        {
            "id":id,
            "email":email,
            "password":password  ,
            "roles":user_roles,
            "first_name":user.first_name ,
            "last_name":user.last_name,
            'total_orders':len(user.user_orders)

         }
        )

#create category
@app.post('/create_category')
def create_category():
    print("categroy")
    request_data = request.get_json()
    name = request_data['category']
    is_category_exist = Category.query.filter_by(category_name=name).first()
    if is_category_exist:
        
        return jsonify({"message": "Category already exists"})
    else:
        create_a_category = Category(category_name=name)
        db.session.add(create_a_category)
        db.session.commit()
        return jsonify({"message": "Successfully created"})


#get categories 
@app.get('/get_categories')
@roles_accepted("admin",'manager')
def get_categories():
    all_categories = Category.query.all()
    categories = []
    for category in all_categories:
        i = {}
        i['category_id'] = category.category_id
        i['name'] = category.category_name
        
        categories.append(i)
    return jsonify({"success":categories})

#delete category
@app.get('/delete_categories/<int:id>')
@roles_required('admin')
def delete_category(id):
    
    delete_category  = Category.query.get(id)
    db.session.delete(delete_category)
    db.session.commit()
    return jsonify({"message":"Successfully deleted category"})

#Edit category
@app.put('/edit_categories')
@roles_required('admin')
def edit_category():
    data = request.get_json()
    id = data['id']
    name = data['name']
    edit_category = db.session.get(Category,id)
    edit_category.category_name = name
    db.session.commit()
    return jsonify({'message':"Category name edited"})



#Add product
@app.post('/create_product')
@roles_required('manager')
def create_product():
    manager = current_user
    data = request.get_json()
    managerid = manager.id
    print(managerid)
    id = data['id']
    
    p_name=data['p_name']
    p_unit=data['p_unit']
    p_rate=data['p_rate']
    p_quantity=data['p_quantity']
    p_mdate=data['p_mdate']
    p_edate=data['p_edate']
    product_name_exists = Product.query.filter_by(product_name=p_name).first()
    if product_name_exists:
        return jsonify({"message":"Product already exists"})
    else:
        e_date =datetime.strptime(p_edate, "%Y-%m-%d").date()          
        m_date= datetime.strptime(p_mdate, "%Y-%m-%d").date()
        create_proudct = Product(product_name=p_name,unit=p_unit,rate_per_unit=p_rate,quantity=p_quantity,m_date=m_date,e_date=e_date,category_id=id,manager_id=managerid)
        db.session.add(create_proudct)
        db.session.commit()
        return jsonify({"message":"Product created successfully"})
#get_all_proudct of a category
@app.post('/get_all_proudct')
@roles_accepted("admin",'manager')
def get_all_proudct():
    data = request.get_json()
    id = data['id']
    products = Product.query.filter_by(category_id=id).all()
    list_product =[]
    for p in products:
        j ={}
        j['id'] = p.product_id
        j['name'] = p.product_name
        j['unit'] = p.unit
        j['quantity'] = p.quantity
        j['rate'] =p.rate_per_unit
        j['mdate']=p.m_date
        j['edate'] =p.e_date
        c_name = Category.query.get(p.category_id)
        j['category_id'] =c_name.category_name
        list_product.append(j)
    return jsonify({'product':list_product})
#Edit product
@app.post('/edit_proudct')
@roles_accepted("admin",'manager')
def edit_proudct():
    data = request.get_json()
    id = data['id']
    quantity = data['quantity']
    rate = data['rate']
    # user_obj = db.session.get(User, 5)
    the_proudct = db.session.get(Product, id)
    the_proudct.rate_per_unit = rate
    the_proudct.quantity = quantity
    db.session.commit()
    return jsonify({'message':"Successfully edited"})


#delete product
@app.delete('/delete_proudct/<int:id>')
@roles_accepted("admin",'manager')
def delete_proudct(id):
    the_proudct = db.session.get(Product, id)
    db.session.delete(the_proudct)
    db.session.commit()
    return jsonify({'message':"Successfully deleted product"})

#get all categories and products from the database for user
@app.get('/get_products_category_user')
def get_products_category_user():
    database_categoires = Category.query.all()
    cat =[]
    for category in database_categoires:
        j ={}
        j['category_id'] = category.category_id
        j['category_name'] = category.category_name
        j['prouducts'] =[]
        for p in category.products:
            i = {}
            i['product_id']=p.product_id
            i['product_name'] = p.product_name
            i['unit'] = p.unit
            i['rate_per_unit'] =p.rate_per_unit
            i['quantity'] =p.quantity
            i['m_date'] =p.m_date.strftime("%Y-%m-%d")
            i['e_date'] =p.e_date.strftime("%Y-%m-%d")
            j['prouducts'].append(i)
        cat.append(j)
    return jsonify({"catePro":cat})

#adding products to the cart
@app.post('/add_to_cart')
def add_to_cart():
    print('cart')
    user = current_user
    data = request.get_json()
    p_id = data['id']
    selected_quantity = int(data['quantity'])
    exist_cart = db.session.get(Cart,(p_id,user.id))
    if  exist_cart:
        exist_cart.quantity = exist_cart.quantity+selected_quantity
        db.session.commit()
    else:
        the_proudct = db.session.get(Product,p_id)

        make_cart = Cart(product_id=p_id,user_id=user.id,quantity=selected_quantity,product_name=the_proudct.product_name,rate=the_proudct.rate_per_unit)
        db.session.add(make_cart)
        db.session.commit()
    return jsonify({"message":"data"})


# getting cart  for specific user
@app.get('/get_cart')
def get_cart():
    user = current_user
    cart = Cart.query.filter_by(user_id=user.id).all()
    cart_all = []
    for c in cart:
        j = {}
        j['quantity'] = c.quantity
        j['product_name'] =c.product_name
        j['rate'] = c.rate
        j['prouduct_id'] = c.product_id
        cart_all.append(j)
    return jsonify(cart_all)

#Buy all products
@app.post('/buy_products')
def buy_products():
    data = request.get_json()
    ids = data['ids']
    user = current_user
    for id in ids:
        product = db.session.get(Product,id['id'])
        if (product.quantity < id['quantity']):
            return jsonify({'message':"The product "+product.product_name+" has less quantity than you selected"})
        else:
            #inserting details in orders_details
            order_details_exits = db.session.get(OrderDetails,(product.product_id,user.id))
            print(order_details_exits)
            if order_details_exits:
                order_details_exits.quantity += id['quantity']
                db.session.commit()
            else:
                current_date_time = datetime.now()
                # Get the current date
                current_date = current_date_time.date()
                current_month = datetime.now().month
                create_order_details = OrderDetails(product_id=product.product_id,user_id=user.id,
                                   quantity=id['quantity'],

                                   date = current_date,
                                   month=current_month
                                   )
                db.session.add(create_order_details)
                db.session.commit()



            order_exists = db.session.get(Orders,(id['id'],user.id))
            product.quantity = product.quantity-id['quantity']
            if(order_exists):
                db.session.commit()
            else:
                user.user_orders.append(product)
            

    user_cart = Cart.query.filter_by(user_id=user.id).all()
    for cart in user_cart:
            db.session.delete(cart)
    db.session.commit()
    return jsonify({'message':'Successfully placed'})


#get orders 
@app.get('/get_orders')
def get_orders():
    user = current_user
    user_object = db.session.get(User,user.id)
    all_orders = user_object.user_orders
    if all_orders:
        get_orders =[]
        for order in all_orders:
            j={}
            j['name'] = order.product_name
            j['price'] = order.rate_per_unit
            details = db.session.get(OrderDetails,(order.product_id,user.id))
            j['purchased_quanity'] = details.quantity
            j['date'] = details.date
            get_orders.append(j)
        return jsonify({"status":'true',"orders":get_orders})
    else:
        return jsonify({"status":"false"})

# Requesting admin for category
@app.post('/manager_request')
@roles_required('manager')
def manager_request():
    data = request.get_json()
    user = current_user
    created_flag = False
    action = data['action']
    if(action =='create'):
        category_name = data['category_name']
        cat_id = 20000

    else:
        cat_id = data['id']
    does_request_exist = Approval.query.filter_by(manager_id = user.id,action=action,category_id =cat_id).first()
    if does_request_exist:
        if does_request_exist.isActive:
            if (action=='create'):
                create_category=Category(category_name = category_name)
                db.session.add(create_category)
                db.session.delete(does_request_exist)
                db.session.commit()
                return jsonify({'message':'Successfully created category'})
            elif (action=='edit'):
                does_category_exist = db.session.get(Category,cat_id)
                if does_category_exist:
                    does_category_exist.category_name = data['category_name']
                    db.session.delete(does_request_exist) 
                    db.session.commit()
                    return jsonify({'message':'Succesfully edited category'})
            else:
                return jsonify({'message':'Your request has been approved you can delete now',"exists": True,'aproved':True})
        else:
            return jsonify({'message':'Your request has not been approved',"exists": True,'aproved':False})
    else:
        create_request = Approval(manager_id =user.id , action=action,category_id=cat_id)
        db.session.add(create_request)
        db.session.commit()
        print("q")
        return jsonify({'message':'Your request has been sent'})

#deleted by manager category
@app.delete('/category_deleted_by_manager')
def delete_category_deleted_by_manager():
    data = request.get_json()
    user = current_user
    aprroved = Approval.query.filter_by(manager_id = user.id,action='delete',category_id=data['id']).first()
    if aprroved.isActive:
        cat = db.session.get(Category,data['id'])
        db.session.delete(cat)
        db.session.delete(aprroved)
        db.session.commit()
        return ({"message":"Successfully deleted"})
    else:
        return ({"message":"Not approved"}) 
# get all request 
@app.get('/request')
@roles_required('admin')
def get_request():
    requestAll = Approval.query.all()
    print(requestAll)
    list = []
    for r in requestAll:
        j ={}
        manger_email = db.session.get(User,r.manager_id).email
        cat_name = db.session.get(Category,r.category_id).category_name if db.session.get(Category,r.category_id) else "not found" 
        j["id"] =r.id
        j['manager_email'] =manger_email
        j['cat_name'] = cat_name
        j['status'] = r.isActive
        j['action'] = r.action
        list.append(j)
    return jsonify(list)

#approve and disprove
@app.post('/aprpove_disprove')
@roles_required('admin')
def aprpove_disprove():
    id = request.get_json()['id']
    ap = db.session.get(Approval , id)
    if ap.isActive:
        ap.isActive = False
    else:
        ap.isActive = True
    db.session.commit()

    return jsonify({'message':'Successful'})

#manager signup
@app.post('/request_for_signup_manager')
def request_for_signup_manager():
    data = request.get_json()
    checked_if_manager_exist = User.query.filter_by(email = data['email']).first()
    if checked_if_manager_exist :
        if "manager" in checked_if_manager_exist.roles:
            return jsonify({'message':'Manager exist'})
    else:
        insert = ManagerSignupRequest(first_name=data['first_name'],last_name=data['last_name'],
                                      email =data['email'],
                                      password =data['password']
                                      )
        db.session.add(insert)
        db.session.commit()
        return jsonify({'message':"Request has been sent successfully"})
    
@app.get('/get_manager_signup_request')
@roles_required('admin')
def get_manager_signup_request():
    requests = ManagerSignupRequest.query.all()
    list =[]
    for req in requests:
        j={}
        j['id'] =req.id
        j['email'] = req.email
        list.append(j)
    return jsonify(list)

#approve manager signup request
@app.post('/approve_manger_signup')
@roles_required('admin')
def approve_manger_signup():
    id = request.get_json()['id']
    requestt = db.session.get(ManagerSignupRequest , id)
    insert ={
        'first_name':requestt.first_name,
        'last_name':requestt.last_name,
        'email':requestt.email,
         'password':requestt.password


    }
    datastore.create_user(**insert)
    db.session.commit()
    insertt = datastore.find_user(email=requestt.email)
    user_role = db.session.get(Role,2)
    insertt.roles.append(user_role)
    db.session.delete(requestt)
    db.session.commit()
    return jsonify({"message": "Approved"})
    
     


if __name__ == '__main__':
    #DEBUG is SET to TRUE. CHANGE FOR PROD
    
    app.run(port=5000)


