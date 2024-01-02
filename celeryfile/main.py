# from ..models import models
from worker import create_celery_app
from models import db
import tasks
from flask import Flask, request
from celery.result import AsyncResult
from celery.schedules import crontab

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///test.db'
db.init_app(app)
cel_app = create_celery_app(app)

@cel_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(10.0, tasks.sum.s(1,2), name='add every 10')
    # Executes every Monday morning at 7:30 a.m
    sender.add_periodic_task(
        crontab(hour='*', minute="56", day_of_week=7),
        # tasks.send_message.s(),
        tasks.sum.s(1,2)
    )



@app.post('/sum')
def sum():
    data = request.json
    a = data['a']
    b= data['b']
    print(a)
    print(b)
    s = tasks.sum.delay(int(a), int(b))
    return str(s.id)
    

@app.get('/get-sum/<id>')
def get_sum(id):
    s = AsyncResult(id)
    res = {
        "Ready": s.ready(),
        "Result": s.result if s.ready() else None
    }
    return res


if __name__ == '__main__':
    app.run(debug=True)