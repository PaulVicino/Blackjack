from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, make_response
from werkzeug.utils import validate_arguments
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, datetime
from . import db
from flask_login import login_user, login_required, logout_user, current_user
from datetime import date, datetime
from random import *
import logging

# this file relates to all places the user can navigate to related to authentification

# this file is a blueprint of our application, meaning it have a lot of routes inside it
# blueprints organize the app so everything isnt in one place

# will get imported into init.py to access all roots located in this file
auth = Blueprint('auth', __name__)

otp = randint(0000000, 9999999)

# login page
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('userName')
        password = request.form.get('password')

        # searches database
        user = User.query.filter_by(username=username).first()

        # date time for checking time between current login and last login to add currency for each user
        today = date.today()
        currDate = today.strftime("%Y-%m-%d") 

        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')

                prevDate = user.dateLastLoggedIn

                years = int(currDate[0:4]) - int(prevDate[0:4])
                months = int(currDate[5:7]) - int(prevDate[5:7])
                days = int(currDate[8:10]) - int(prevDate[8:10])

                # calculation between days
                totalDays = (years * 365) + (months * 30) + days
                
                if totalDays > 0:
                    currency = float(500 * totalDays)
                    userCurrency = user.currency + currency
                    user.currency = userCurrency
                    db.session.commit()
                
                user.dateLastLoggedIn = currDate
                db.session.commit()

                login_user(user, remember=True)
                return redirect(url_for('views.home', user=current_user))
            else:
                flash('Login Failed', category='error')
        else:
            flash('Login Failed', category='error')

    return render_template("login.html", user=current_user)
    
# logout button
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

# create account page
@auth.route('/create-account', methods=['GET', 'POST'])
def create_account():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('userName')
        password = request.form.get('password1')
        confirmPassword = request.form.get('password2')
        dateOfBirth = request.form.get('dateOfBirth') # '2021-08-09' YYYY-MM-DD

        today = date.today()
        currDate = today.strftime("%Y-%m-%d") 

        user = User.query.filter_by(username=username).first()
        user1 = User.query.filter_by(email=email).first()

        passCheck = passwordCheck(password, confirmPassword)

        if user1:
            flash('Email already exists', category='error')
        elif user:
            flash('Username already exists', category='error')
        elif len(email) < 5:
            flash('Email is too short', category='error')
        elif passCheck == 1:
            flash('Password is too short', category='error')
        elif passCheck == 2:
            flash('Password is too long', category='error')
        elif passCheck == 3:
            flash('Passwords do not match', category='error')
        elif passCheck == 4:
            flash('Password must contain a special character', category='error')
        elif passCheck == 5:
            flash('Password must contain a lowercase letter', category='error')
        elif passCheck == 6:
            flash('Password must contain an uppercase letter', category='error')
        elif passCheck == 7:
            flash('Password must contain a number', category='error')
        elif birthCheck(dateOfBirth):
            flash('Must be 21 years or older to play', category='error')
        else:
            # make a User object and initiialize it
            new_user = User(email=email, username=username, password=generate_password_hash(password, method='sha256'), 
            dateOfBirth=datetime.strptime(dateOfBirth, '%Y-%m-%d'), isAdmin=0, isMod=0, isAuthenticated = 1, acceptedDisclaimer = 0, currency=10000, 
            points=0, numPlayers=3, numDecks=4, deckPenetration=0.50, minBet=10, maxBet=500, countSpoiler=0, peekingOption=1, doubleAfterSplit=1, 
            blackjackPayout=3/2, hitSplitAces=1, hitStandSoftSeventeen=0, doubleOption=0, dateCreated=currDate, dateLastLoggedIn=currDate)

            # add user to database
            db.session.add(new_user)
            db.session.commit()
            
            flash('Account created', category='success')
            login_user(new_user, remember=True)

            # redirect to home page
            return render_template("disclaimer.html", user=current_user)

    return render_template("create_account.html", user=current_user)

# Checks if entered password meets password requirements
def passwordCheck(password, confirmPassword):
    
    symbols = {'#', '@', '!', '-', '$'}
    
    var = 0

    if len(password) < 8:
        var = 1
    if len(password) > 32:
        var = 2
    if password != confirmPassword:
        var = 3
    if not any(char in symbols for char in password):
        var = 4
    if not any(char.islower() for char in password):
        var = 5
    if not any(char.isupper() for char in password):
        var = 6
    if not any(char.isdigit() for char in password):
        var = 7

    return var

# Check's to see if a user is older than 21
def birthCheck(dateOfBirth):

    today = date.today()
    var = True

    # date time to check current date
    currDate = today.strftime("%Y-%m-%d") 
    year = int(currDate[0:4])
    month = int(currDate[5:7])
    day = int(currDate[8:10])

    # date time information to check if a user is over 21
    playerYear = int(dateOfBirth[0:4])
    playerMo = int(dateOfBirth[5:7])
    playerDay = int(dateOfBirth[8:10])

    diffYear = year - playerYear
    diffMo = month - playerMo
    diffDay = day - playerDay

    if (diffYear < 0):
        diffYear = 0
    if (diffMo < 0):
        diffMo = 0
    if (diffDay < 0):
        diffDay = 0

    age = diffYear * 365 + diffMo * 30 + diffDay
    currAge = age / 7665

    if (currAge >= 1):
        var = False

    return var