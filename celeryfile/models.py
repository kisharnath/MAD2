from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Sum(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sum = db.Column(db.Integer)