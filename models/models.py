from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin, login_required
from sqlalchemy import MetaData

naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))
roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(),
                                 db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(),
                                 db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String, unique=False)
    last_name=db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    user_orders = db.relationship('Product' ,backref='order_ordered_by' ,secondary = 'orders')    
    user_cart =db.relationship('Product',backref='cart_ordered_by',secondary = 'cart')

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
#all categories
class Category(db.Model):
    category_id = db.Column(db.Integer,primary_key = True)
    category_name= db.Column(db.String,nullable=False)
    products = db.relationship('Product',backref='category_ofthis_product',cascade='all, delete')


#all products 
class Product(db.Model):
    product_id = db.Column(db.Integer,primary_key=True)
    product_name = db.Column(db.String,nullable=False)
    unit =db.Column(db.String,nullable=False)
    rate_per_unit = db.Column(db.Integer,nullable=False)
    quantity = db.Column(db.Integer,nullable=False)
    m_date = db.Column(db.Date,nullable=False)
    e_date = db.Column(db.Date,nullable=False)
    category_id = db.Column(db.Integer,db.ForeignKey("category.category_id"))
    manager_id = db.Column(db.Integer)

#all cart items
class Cart(db.Model):
    product_id = db.Column(db.Integer,db.ForeignKey("product.product_id"),primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"),primary_key=True)
    quantity = db.Column(db.Integer,nullable=False)
    product_name=db.Column(db.String(255),nullable=False)
    rate = db.Column(db.Integer,nullable=False)


#All orders
class Orders(db.Model):
    # order_id = db.Column(db.Integer,primary_key=True)
    # product_id = db.Column(db.Integer,db.ForeignKey("product.product_id") )
    # user_id = db.Column(db.Integer,db.ForeignKey("user.id"))
    # quantity = db.Column(db.Integer,nullable=False)
    # product_name=db.Column(db.String(255),nullable=False)
    # rate = db.Column(db.Integer,nullable=False)
    product_id = db.Column(db.Integer,db.ForeignKey('product.product_id'),primary_key = True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),primary_key = True)
class OrderDetails(db.Model):
    product_id = db.Column(db.Integer,db.ForeignKey('product.product_id'),primary_key = True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),primary_key = True)
    quantity = db.Column(db.Integer,nullable=False)
    date = db.Column(db.Date,nullable=False)
    month = db.Column(db.Integer)
class Approval(db.Model):
    id= db.Column(db.Integer,primary_key=True)
    manager_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    action =db.Column(db.String,nullable = False)
    category_id = db.Column(db.Integer,db.ForeignKey('category.category_id'),nullable=False)
    isActive = db.Column(db.Boolean(),default=False)
class ManagerSignupRequest(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String, unique=False)
    last_name=db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255)) 


