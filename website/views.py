from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, make_response
from flask.helpers import flash, make_response
from flask_login import login_required, current_user
import json
from sqlalchemy.util.langhelpers import portable_instancemethod
from . import db
from .models import User
from sqlalchemy import desc, func
import json

# this file is a blueprint of our application, meaning it have a lot of routes inside it
# blueprints organize the app so everything isnt in one place

# render templates call the HTML files, and can also pass variables such as
# dictionaries, lists, and python objects to the HTML file
# the HTML file can use they variables with a library called Jinja2
# which also allows for loops, conditional statements, and more

# will get imported into init.py to access all roots located in this file
views = Blueprint('views', __name__)

# these routes are called endpoints and link the URLs with the HTML templates
# runs whenever we go to sdblackjack.com/
@views.route('/', methods=['GET', 'POST'])
@login_required
def home():

    return render_template("home.html", user=current_user)

@views.route('/Leaderboard/')
@login_required #look into redirecting
def leaderboard():
    # get top 100 users, and pass their username + points to the leaderboard
    users = User.query.order_by(User.points.desc()).limit(100).all()

    # this is a list
    rank = User.query.order_by(User.points.desc()).all()

    # gives the rank of the current user
    spot = rank.index(current_user) + 1

    # new_player = Player(_id=current_user.id, stack_size=10000, betting_unit_in_dollars=40)

    return render_template("leaderboard.html", user=current_user, users=users, rank=spot)

@views.route('/Information/')
@login_required
def information():
    return render_template("information.html", user=current_user)

# User accepted disclaimer and routes to home page
@views.route('/Disclaimer')
@login_required
def disclaimer():
    
    user = User.query.filter_by(username=current_user.username).first()        

    user.acceptedDisclaimer = 1

    db.session.commit()
    
    return redirect(url_for('views.home', user=current_user))

# Route/API to send user info to and from other pages
# Sends the newUser dictionary with the user points and currency from the db
# Sends a 200 response to show good connection from API call
@views.route('/SendUser', methods=['GET'])
def updateUser():
    user = User.query.filter_by(username=current_user.username).first()
    
    currUser = {
        'points': user.points,
        'currency': user.currency,
        'players': user.numPlayers,
        'decks': user.numDecks,
        'deckPenetration': user.deckPenetration,
        'min': user.minBet,
        'max': user.maxBet,
        'spoiler': user.countSpoiler,
        'peeking': user.peekingOption,
        'payout': user.blackjackPayout,
        'split': user.hitSplitAces,
        'doubleSplit': user.doubleAfterSplit,
        'hitStandSoftSeventeen': user.hitStandSoftSeventeen,
        'doubleOpt': user.doubleOption
    }
    
    return make_response(jsonify(currUser), 200)

@views.route('/UpdatePoints', methods=['POST'])
def updatePoints():
    user = User.query.filter_by(username=current_user.username).first()
    request_data = request.get_json()
    
    currUser = {
        'points': request_data["points"]
    }
    user.points = request_data["points"]

    db.session.commit()

    return make_response(jsonify(currUser), 200)


@views.route('/UpdateCurrency', methods=['POST'])
def updateCurrency():
    user = User.query.filter_by(username=current_user.username).first()
    request_data = request.get_json()
    
    currUser = {
        'currency': request_data["currency"]
    }
    user.currency = request_data["currency"]

    db.session.commit()

    return make_response(jsonify(currUser), 200)
    

@views.route('/UpdateSettings', methods=['POST'])
def updateSettings():
    user = User.query.filter_by(username=current_user.username).first()
    request_data = request.get_json()

    currUser = {
        'numPlayers': request_data["players"],
        'numDecks': request_data["decks"],
        'deckPenetration': request_data["deckPenetration"],
        'minBet': request_data["min"],
        'maxBet': request_data["max"],
        'countSpoiler': request_data["spoiler"],
        'peekingOption': request_data["peeking"],
        'blackjackPayout': request_data["payout"],
        'hitSplitAces': request_data["split"],
        'doubleAfterSplit': request_data["doubleSplit"],
        'hitStandSoftSeventeen': request_data["hitStandSoftSeventeen"],
        'doubleOption': request_data["doubleOpt"]
    }
    user.numPlayers = request_data["players"]
    user.numDecks = request_data["decks"]
    user.deckPenetration = request_data["deckPenetration"]
    user.minBet = request_data["min"]
    user.maxBet = request_data["max"]
    user.countSpoiler = request_data["spoiler"]
    user.peekingOption = request_data["peeking"]
    user.blackjackPayout = request_data["payout"]
    user.hitSplitAces = request_data["split"]
    user.doubleAfterSplit = request_data["doubleSplit"]
    user.hitStandSoftSeventeen = request_data["hitStandSoftSeventeen"]
    user.doubleOption = request_data["doubleOpt"]
    
    db.session.commit()

    return make_response(jsonify(currUser), 200)


# everything below here is related to the Information pages

@views.route('/definitions/')
def definitionsPage():
    return render_template("/InformationPages/definitions.html", user=current_user)

@views.route('/etiquette/')
def etiquettePage():
    return render_template("/InformationPages/etiquette.html", user=current_user)

@views.route('/strategy/')
def strategyPage():
    return render_template("/InformationPages/strategy.html", user=current_user)

@views.route('/counting/')
def countingPage():
    return render_template("/InformationPages/counting.html", user=current_user)

@views.route('/deviations/')
def deviationsPage():
    return render_template("/InformationPages/deviations.html", user=current_user)

@views.route('/betspreads/')
def betSpreadPage():
    return render_template("/InformationPages/betspreads.html", user=current_user)
