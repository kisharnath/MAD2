from flask_security import Security, SQLAlchemyUserDatastore,UserMixin, RoleMixin, login_required
class Config(object):
    
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///GroceryDatabase.sqlite3'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_LOGIN_MULTIPLE =  True
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    #mail service 
    # MAIL_SERVER='smtp.gmail.com'
    # MAIL_PORT = 465
    # MAIL_USERNAME = 'kisharnat@gmail.com'
    # MAIL_PASSWORD = 'Kishar143@'
    # MAIL_USE_TLS= False
    # MAIL_USE_SSL= True



class DevelopmentConfig(Config):
    DEBUG = True