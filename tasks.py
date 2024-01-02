from celery import shared_task
from flask import  Response
import csv
import io
from models.models import *
import time
from flask_mail import Mail
from flask_mail import Message
from datetime import datetime
from sqlalchemy import extract
mail = Mail()
@shared_task(ignore_result=False)
def send():
    # create_manager = ManagerSignupRequest(first_name='kishar',last_name='nath',email='l@gmail.com',password='k')
    # db.session.add(create_manager)
    # db.session.commit()
    all_users = User.query.all()
    for user in all_users:
        current_date_time = datetime.now()
        # Get the current date
        current_date = current_date_time.date()
        getUserStatus = OrderDetails.query.filter_by(user_id =user.id ,date=current_date).all()
        if getUserStatus==[]:
            emailUser = user.email
            print(emailUser)
            msg = Message("Hello tody you have not bought anything",
                  sender="kisharnat@gmail.com",
                  recipients=[emailUser])
            mail.send(msg)
    return "send"

        


    


@shared_task(ignore_result=False)
def send_report():
    all_users = User.query.all()
    user_email = ''
    total_purchase =0
    total_amount=0
    for user in all_users:
        user_email = user.email

        current_date_time = datetime.now()
        current_month = datetime.now().month
        getUserStatus = OrderDetails.query.filter_by(user_id = user.id , month = current_month).all()
        total_purchase = 0
        total_amount =0
        for item in getUserStatus:
            total_purchase+= item.quantity
            product_details = Product.query.filter_by(product_id = item.product_id).first()
            total_amount+= product_details.rate_per_unit * item.quantity
       
        msg = Message(f"Hello your total purchase${total_purchase}and total amount ${total_amount}",
                  sender="kisharnat@gmail.com",
                  recipients=[user_email])
        mail.send(msg)
        total_purchase =0
        total_amount=0
    return "send"


   
    
@shared_task(ignore_result=False)
def get_csv_file(id):
    all_products = Product.query.filter_by(manager_id=id).all()
    csv_data =["Product_name" ,"Unit","Price","Quantity","TotalOrder"]
    with open('data.csv' , 'w' ,newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(csv_data)
        for product in all_products:
        
            p = OrderDetails.query.filter_by(product_id=product.product_id).first()
            ordered=p.quantity if p else 0
            
            csvwriter.writerow([product.product_name,product.unit,product.rate_per_unit,product.quantity,ordered])
    return "job started"


    
       
