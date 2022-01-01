from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

# whenever you have an __init__.py file in a folder it becomes a python package, which means
# when you import the name of the folder, it will by default run everything in the init file

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'iafjaoifaoifjasiofja'

    #initializes database
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    # importing the variables views and auth from the files views.py and auth.py
    # the variables store the blueprints
    from .views import views
    from .auth import auth

    # registering the blueprints we made
    app.register_blueprint(views, url_prefix = '/')
    app.register_blueprint(auth, url_prefix = '/')

    # import database stuff
    from .models import User

    #make database
    create_database(app)

    # handle log ins, and make sure users that arent logged in get redirected to login page
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    #looks for primary key
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

# function that, you guessed it, creates a database
def create_database(app):
    if not path.exists('website/' + DB_NAME):
        db.create_all(app=app)
        print('Created Database!')

# pretty sure these lines here are for production, but they shouldnt affect development
app = create_app()

if __name__ == "__main__":
    app.run()
