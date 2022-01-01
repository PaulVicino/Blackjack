from website import create_app

# this file creates the app by calling create_app in website > init.py

app = create_app()

# only if we run this file (not if we import this file), will we execute this line
# prevents the app from running if you accidentally import main from another file
if __name__ == '__main__':
    app.run(debug=True)

# this youtube video gives a baseline rundown of how flask works
# https://youtu.be/dam0GPOAvVI


# Todo:
# navbar with users name on it
# set up info page stuff
# - both info and username should have dropdowns to them
# - download link
# - plan the pages that I want to include