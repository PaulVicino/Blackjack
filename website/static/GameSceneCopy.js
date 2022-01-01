"use strict";

// cards x & y positions 1-5 for players 1-7 + dealer 
const cardX = [[965, 705, 425, 705], [950, 690, 410, 720], [935, 675, 395, 735], [920, 660, 380, 750], [905, 645, 365, 765], [890, 630, 350, 780]];
const cardY = [[425, 425, 425, 95], [405, 405, 405, 115], [385, 385, 385, 135], [365, 365, 365, 155], [345, 345, 345, 175], [325, 325, 325, 195]];
const cardA = [0, 0, 0, 0];

// const cardX = [[965, 705, 428, 705], [950, 685, 405, 725], [925, 660, 385, 745], [910, 640, 365, 765], [895, 620, 345, 785]];
// const cardY = [[361, 445, 355, 75], [350, 420, 335, 95], [325, 400, 310, 115], [300, 380, 295, 135], [275, 360, 270, 155]];
// const cardA = [-33, 0, 32, 0];

const spriteNames = ['AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 
                    'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC',
                    'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 
                    'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH'];

const spriteValues = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 
                    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 
                    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 
                    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

// doesnt handle splits right now
let playerCards = [[], [], []];
// displays info on right side
let player1CardDisplay;
let player2CardDisplay;
let player3CardDisplay;

let dealerCards = [];
let dealerCardDisplay;

let currencyScoreBoard;
let pointScoreBoard;
let runningCountScoreBoard;
let runningCount = 0;
let trueCountScoreBoard;
let trueCount = 0;

let cardIndex = 0;


// changeable settings
let numDecks = 1;
let numPlayers = 1;
let deckPen = .1;
let playerCurrency = 500;
let playerPoints = 0;
let minBet = 5;
let maxBet = 500;

// global variables that were created in create function
let bg;
let controlPanel;
let shuffledDeck;
let cardInts;
let dealerCard;
let dealerIndex
let deck;

let whiteChip_1_Button;
let redChip_5_Button;
let blueChip_10_Button;
let greenChip_25_Button;
let blackChip_100_Button;

let player3TurnIndicator;
let player2TurnIndicator;
let player1TurnIndicator;

// player 1 initial chip coords = 965, 540
// player 2 initial chip coords = 705, 540
// player 3 initial chip coords = 425, 540
let player1ChipXCoords = 965;
let player2ChipXCoords = 705;
let player3ChipXCoords = 425;
let playerChipYCoords = 525;


let currentPlayer;
let currentBet;
let placeholderBet;
let numChips;
let player1Bet;
let player2Bet;
let player3Bet;
let player1InsuranceBet;
let player2InsuranceBet;
let player3InsuranceBet;
let player1ChipCount = [];
let player2ChipCount = [];
let player3ChipCount = [];
let player1DoubleChipCount = [];
let player2DoubleChipCount = [];
let player3DoubleChipCount = [];
let player1InsuranceChips = [];
let player2InsuranceChips = [];
let player3InsuranceChips = [];
let placeholderChipArray = [];
let didPlayersSurrender = [0, 0, 0];
let isPlayerInsured = [0,0,0];

let playerHit;
let hitText;
let playerDouble;
let doubleText;
let playerStand;
let standText;
let playerSurrender;
let surrenderText;
let playerInsurance;
let insuranceText;
let playerSplit;
let splitText;

let disclaimer;
let shuffleAnimation;

let nextRoundButton;
let nextBettorButton;


//TODO:
// add splits

// space out player displays more (to account for possible splits)
// make suggestion displays on the right side (same y-level as corresponding player displays), also
// show "Correct" or "Incorrect" for the users actions, as well as how much each hand profited/lost that round
// add surrender and insurance actions to basic strategy point chart

// make warning to user that they cant play if they dont have minbet * numplayers amount of currency
// write profit/loss from each hand for each round in bottom right

// (WHAT GRAHAM SHOULD BE DOING)
// get email auth and password reset working (including the drop down)
// add new columns to database (isAuthenticated, acceptedDisclaimer, didTutorial)
// change currency column in database to float if it isnt already
// send user info to GameScene.js (username, currency, points)
// update user currencies in iswinorloss function (database wise)
// give all authenticated users 500 currency a day


// iron out kinks in the account creation and login process
//    * when logging in, should say "login failed" rather than specifying username or password being bad
//    * check for valid date when creating account
// make a gambling disclaimer (show example pic)
// fix up navbar (make bigger and bold the current users page)


// BUGS/TESTING:


// make setting sliders
// updateinfo function not done yet (splits, ect)

// NOTES:
// early surrender is currently implemented, will add a toggle to only allow late surrender (after dealer checks for BJ)
// should only take insurance at a TRUE 3 or above

let gameOptions = {
 
    // card width, in pixels
    cardWidth: 560,
 
    // card height, in pixels
    cardHeight: 780,
 
    // card scale. 1 = original size, 0.5 half size and so on
    cardScale: 0.1325
}

let textStyle = {
    font: "normal 24px Arial",
    fill: '#000000',
    align: 'center',
    boundsAlignH: "center", // bounds center align horizontally
    boundsAlignV: "middle" // bounds center align vertically
};

function updateInfo(i, j) {

    currencyScoreBoard.setText("Currency: $" + playerCurrency);
    pointScoreBoard.setText("Points: " + playerPoints);

    if (j < 3)
    {
        if (playerCards[j][i] === "A" || playerCards[j][i] === "K" || playerCards[j][i] === "Q" || 
        playerCards[j][i] === "J" || playerCards[j][i] === "10")
        {
            runningCount = runningCount - 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else if (playerCards[j][i] === "7" || playerCards[j][i] === "8" || playerCards[j][i] === "9"  )
        {
            runningCount = runningCount;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else if (playerCards[j][i] === "2" || playerCards[j][i] === "3" || playerCards[j][i] === "4" || 
        playerCards[j][i] === "5" || playerCards[j][i] === "6")
        {
            runningCount = runningCount + 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }

        if (i == 0)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i] + "]");
        }
        else if (i == 1)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
        }
        else if (i == 2)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-2] + "," + playerCards[j][i-1]  + "," + playerCards[j][i] +  "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-2] + "," + playerCards[j][i-1]  + "," + playerCards[j][i] +  "]");
        }
        else if (i == 3)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
        }
        else if (i == 4)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
        }
        else if (i == 5)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
        }
        else if (i == 6)
        {
            if (j == 0)
                player1CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-6] + "," + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 1)
                player2CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-6] + "," + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
            else if (j == 2)
                player3CardDisplay.setText("Player" + (j + 1) + " Cards:\n[" + playerCards[j][i-6] + "," + playerCards[j][i-5] + "," + playerCards[j][i-4] + "," + playerCards[j][i-3] + "," + playerCards[j][i-2] + "," + playerCards[j][i-1] + "," + playerCards[j][i] + "]");
        }
        // gonna have to continue this if/else for all card combinations, 
        // such as having 5 cards, also need to take splits into consideration

    }
    else
    {
        if (dealerCards[i] === "A" || dealerCards[i] === "K" || dealerCards[i] === "Q" || 
            dealerCards[i] === "J" || dealerCards[i] === "10")
        {
            runningCount = runningCount - 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else if (dealerCards[i] === "7" || dealerCards[i] === "8" || dealerCards[i] === "9"  )
        {
            runningCount = runningCount;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else if (dealerCards[i] === "2" || dealerCards[i] === "3" || dealerCards[i] === "4" || 
        dealerCards[i] === "5" || dealerCards[i] === "6")
        {
            runningCount = runningCount + 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }

        if (i == 0)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i] + "]");
        }
        else if (i == 1)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[?, " + dealerCards[i] + "]");
        }
        else if (i == 2)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i-2] + ", " + dealerCards[i-1] + ", " + dealerCards[i] + "]");
        }
        else if (i == 3)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i-3] + ", " + dealerCards[i-2] + ", " + dealerCards[i-1] + ", " + dealerCards[i] + "]");
        }
        else if (i == 4)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i-4] + ", " + dealerCards[i-3] + ", " + dealerCards[i-2] + ", " + dealerCards[i-1] + ", " + dealerCards[i] + "]");
        }
        else if (i == 5)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i-5] + ", " + dealerCards[i-4] + ", " + dealerCards[i-3] + ", " + dealerCards[i-2] + ", " + dealerCards[i-1] + ", " + dealerCards[i] + "]");
        }
        else if (i == 6)
        {
            dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[i-6] + ", " + dealerCards[i-5] + ", " + dealerCards[i-4] + ", " + dealerCards[i-3] + ", " + dealerCards[i-2] + ", " + dealerCards[i-1] + ", " + dealerCards[i] + "]");
        }
    }
};

class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    };

    drawDealerCards(dealerCards, cardIndex, cardInts, i) {
       
        const enableNextRoundButton = this.enableNextRoundButton;

        if (numPlayers == 1 && this.isBust(playerCards[0]))
        {
            // do nothing
            enableNextRoundButton();
        }
        else if (numPlayers == 2 && this.isBust(playerCards[0]) && this.isBust(playerCards[1]))
        {
            // do nothing
            enableNextRoundButton();
        }
        else if (numPlayers == 3 && this.isBust(playerCards[0]) && this.isBust(playerCards[1]) && this.isBust(playerCards[2]))
        {
            // do nothing
            enableNextRoundButton();
        }
        else
        {
            var length = 2;
            var timeline = this.tweens.createTimeline();
            var j = 3;
        
            while(this.getHandValue(dealerCards) < 17)
            {
                dealerCards[i] = (this.getValue(cardInts, cardIndex));
                this.dealCard(cardInts[cardIndex], shuffledDeck, timeline, i, 3, 0, dealerCard);
    
                i++;
                cardIndex++;
            }
    
            timeline.play();
    
            timeline.addListener("complete", function(){
                enableNextRoundButton();
            })
        }
    };
    
    hitCard(cardIndex, shuffledDeck, i, j) {
        
        // const updateInfo = this.updateInfo;
        const isBust = this.isBust;
        this.tweens.add({
            targets: shuffledDeck[cardIndex],
            x: cardX[i][j],
            y: cardY[i][j],
            angle: cardA[j],
            ease: 'Linear',
            duration: 200,
            // repeat: 0,
            yoyo: false,
            delay: 500,
            onComplete: function() {
    
                shuffledDeck[cardIndex].setDepth(i);
    
                updateInfo(i, j);

                if (isBust(playerCards[j]))
                {
                    if (j == 0)
                    {
                        player1CardDisplay.setTint(0x8E1600);
                    }
                    else if (j == 1)
                    {
                        player2CardDisplay.setTint(0x8E1600);
                    }
                    else if (j == 2)
                    {
                        player3CardDisplay.setTint(0x8E1600);
                    }
                }
            }
        })
    };

    splitCard() {

    };
    
    // plays card dealing animations
    dealCard(cardIndex, shuffledDeck, timeline, i, j, isDealerCard, dealerCard) {
    
        // i = card
        // j = player
        // [card][player]

        // console.log(cardInts[cardIndex]);
    
        if (isDealerCard)
        {
            timeline.add({
                targets: dealerCard,
                x: cardX[i][j],
                y: cardY[i][j],
                angle: cardA[j],
                ease: 'Linear',
                duration: 200,
                // repeat: 0,
                yoyo: false,
                delay: 500,
                onComplete: function() {
    
                    dealerCard.setDepth(i);
                    dealerCardDisplay.setText("Dealer Cards:\n[?]");
                }
            })
        }
        else
        {
            // const updateInfo = this.updateInfo;
            timeline.add({
                targets: shuffledDeck[cardIndex],
                x: cardX[i][j],
                y: cardY[i][j],
                angle: cardA[j],
                ease: 'Linear',
                duration: 200,
                // repeat: 0,
                yoyo: false,
                delay: 500,
                onComplete: function() {
    
                    shuffledDeck[cardIndex].setDepth(i);
    
                    updateInfo(i, j);
                }
            })
        }
    };

    // creates deck
    initializeDeck(numDecks) {

        // create an array with 52 * numDecks, with one row for card sprites, and one row for card values
        // this.deckOfCards = Phaser.Utils.Array.NumberArray((0, (51 * numDecks) + (numDecks - 1)));
        shuffledDeck = Phaser.Utils.Array.NumberArray((0, (51 * numDecks) + (numDecks - 1)));

        for (let i = 0; i < ((51 * numDecks) + (numDecks - 1)); i++)
        {
            // this.deckOfCards[i] = this.add.sprite(900, 75, "cards", i % 52);
            // this.deckOfCards[i].setScale(gameOptions.cardScale);
            
            shuffledDeck[i] = this.add.sprite(900, 75, "cards", i % 52);
            shuffledDeck[i].setScale(gameOptions.cardScale);
        }

        // return this.deckOfCards;
    }

    shuffleInts(numDecks){
        // this.cardInts = Phaser.Utils.Array.NumberArray((0, (51 * numDecks) + (numDecks - 1)));
        cardInts = Phaser.Utils.Array.NumberArray((0, (51 * numDecks) + (numDecks - 1)));

        for (let i = 0; i < ((51 * numDecks) + (numDecks - 1)); i++)
        {
           //  this.cardInts[i] = i;
           cardInts[i] = i;
        }

        // Phaser.Utils.Array.Shuffle(this.cardInts);
        Phaser.Utils.Array.Shuffle(cardInts);

        // return this.cardInts;
    };

    // finds the values of each sprite
    getValue(cardInts, cardIndex) {

    if (cardInts[cardIndex] % 13 == 0)
        return "A";
    else if (cardInts[cardIndex] % 13 == 1)
        return "2";
    else if (cardInts[cardIndex] % 13 == 2)
        return "3";
    else if (cardInts[cardIndex] % 13 == 3)
        return "4";
    else if (cardInts[cardIndex] % 13 == 4)
        return "5";
    else if (cardInts[cardIndex] % 13 == 5)
        return "6";
    else if (cardInts[cardIndex] % 13 == 6)
        return "7";
    else if (cardInts[cardIndex] % 13 == 7)
        return "8";
    else if (cardInts[cardIndex] % 13 == 8)
        return "9";
    else if (cardInts[cardIndex] % 13 == 9)
        return '10';
    else if (cardInts[cardIndex] % 13 == 10)
        return "J";
    else if (cardInts[cardIndex] % 13 == 11)
        return "Q";
    else if (cardInts[cardIndex] % 13 == 12)
        return "K";

    };

    getHandValue(playerCards) {
        var length = playerCards.length;
        var sum = 0;
        var aceCount = 0;

        for (let i = 0; i < length; i++)
        {
            if (playerCards[i] === "A")
            {
                aceCount++;
            }
            else if (playerCards[i] === "10" || playerCards[i] === "J" || playerCards[i] === "Q" || playerCards[i] === "K")
            {
                sum = sum + 10;
            }
            else
            {
                sum = sum + parseInt(playerCards[i], 10);
            }
        }

        while (aceCount > 0)
        {
            if (sum + 11 > 21)
                sum = sum + 1;
            else
                sum = sum + 11;

            aceCount--;
        }

        return sum;
    };
    
    isBlackjack(playerCards) {
        var length = playerCards.length;
        var sum = 0;

        if (length != 2)
            return false;
        
        for (let i = 0; i < length; i++)
        {
            if (playerCards[i] === "A")
            {
                sum = sum + 11;
            }
            else if (playerCards[i] === "10" || playerCards[i] === "J" || playerCards[i] === "Q" || playerCards[i] === "K")
            {
                sum = sum + 10;
            }
        }

        if (sum == 21)
            return true;

        return false;
    };

    isBust(playerCards) {
        var length = playerCards.length;
        var sum = 0;
        var aceCount = 0;

        for (let i = 0; i < length; i++)
        {
            if (playerCards[i] === "A")
            {
                aceCount++;
            }
            else if (playerCards[i] === "10" || playerCards[i] === "J" || playerCards[i] === "Q" || playerCards[i] === "K")
            {
                sum = sum + 10;
            }
            else
            {
                sum = sum + parseInt(playerCards[i], 10);
            }
        }

        if (sum + 11 + (aceCount - 1) > 21)
        {
            sum = sum + aceCount;
            aceCount = 0;
        }

        while (aceCount > 0)
        {
            if (sum + 11 > 21)
                sum = sum + 1;
            else
                sum = sum + 11;

            aceCount--;
        }

        if (sum > 21)
            return true;

        return false;
    };

    isWinOrLoss() {

        let dealerHandValue = this.getHandValue(dealerCards);

        for (let i = 0; i < numPlayers; i++)
        {
            let handValue = this.getHandValue(playerCards[i]);

            if (didPlayersSurrender[i])
            {
                // hand loses (surrender) (money already handled earlier)
                if (i == 0)
                {
                    player1CardDisplay.setTint(0xFFA500);
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0xFFA500);
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0xFFA500);
                }
            }
            else if (this.isBust(playerCards[i]))
            {
                // hand loses
                if (i == 0)
                {
                    player1CardDisplay.setTint(0x8E1600);
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0x8E1600);
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0x8E1600);
                }
            }
            else if (this.isBlackjack(dealerCards) && !this.isBlackjack(playerCards[i]))
            {
                // hand loses
                if (i == 0)
                {
                    player1CardDisplay.setTint(0x8E1600);
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0x8E1600);
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0x8E1600);
                }
            }
            else if (this.isBlackjack(playerCards[i]) && this.isBlackjack(dealerCards))
            {
                //push
                if (i == 0)
                {
                    player1CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player1Bet;
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player2Bet;
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player3Bet;
                }
            }
            else if (this.isBlackjack(playerCards[i]))
            {
                // blackjack
                if (i == 0)
                {
                    player1CardDisplay.setTint(0xFFD700);
                    playerCurrency = playerCurrency + (1.5 * player1Bet) + player1Bet;
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0xFFD700);
                    playerCurrency = playerCurrency + (1.5 * player2Bet) + player2Bet;
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0xFFD700);
                    playerCurrency = playerCurrency + (1.5 * player3Bet) + player3Bet;
                }
            }
            else if ((handValue > dealerHandValue && handValue < 22) || (handValue < 22 && dealerHandValue > 21))
            {
                // hand wins
                if (i == 0)
                {
                    player1CardDisplay.setTint(0x00FF00);
                    playerCurrency = playerCurrency + (2 * player1Bet);
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0x00FF00);
                    playerCurrency = playerCurrency + (2 * player2Bet);
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0x00FF00);
                    playerCurrency = playerCurrency + (2 * player3Bet);
                }
            }
            else if (handValue == dealerHandValue)
            {
                // push
                if (i == 0)
                {
                    player1CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player1Bet;
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player2Bet;
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0xFFFFFF);
                    playerCurrency = playerCurrency + player3Bet;
                }
            }
            else
            {
                // hand loses
                if (i == 0)
                {
                    player1CardDisplay.setTint(0x8E1600);
                }
                else if (i == 1)
                {
                    player2CardDisplay.setTint(0x8E1600);
                }
                else if (i == 2)
                {
                    player3CardDisplay.setTint(0x8E1600);
                }
            }
        }

        // check insurance bets
        if (this.isBlackjack(dealerCards) && isPlayerInsured[0] == 1)
        {
            playerCurrency = playerCurrency + (3 * player1InsuranceBet);
        }
        else if (this.isBlackjack(dealerCards) && isPlayerInsured[1] == 1)
        {
            playerCurrency = playerCurrency + (3 * player2InsuranceBet);
        }
        else if (this.isBlackjack(dealerCards) && isPlayerInsured[2] == 1)
        {
            playerCurrency = playerCurrency + (3 * player3InsuranceBet);
        }


        currencyScoreBoard.setText("Currency: $" + playerCurrency);
    };

    // pass true count, can split or not
    baseGameBasicStrategy(currentPlayer, action) {

        // soft = has ace
        var isSoft = 0;

        var isPair = 0;

        // action should be: Hit, Double, Stand, Surrender, Insurance, or Split

        for (let i = 0; i < playerCards[currentPlayer].length; i++)
            if (playerCards[currentPlayer][i] === "A")
                isSoft = 1;

        if (playerCards[currentPlayer][0] === playerCards[currentPlayer][1] && playerCards[currentPlayer].length == 2)
            isPair = 1;

        if (isPair == 1)
        {
            // covers pairs of 2's
            if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "4" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "5" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "6" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "7" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "2" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 3's
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "4" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "5" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "6" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "7" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "3" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 4's
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "4" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "5" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "6" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "4" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 5's
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "2" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "7" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "8" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "9" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "5" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 6's
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "3" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "4" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "5" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "6" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "6" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 7's
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "2" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "3" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "4" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "5" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "6" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "7" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "7" && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // covers pairs of 8's (always split)
            else if (playerCards[currentPlayer][0] === "8" && action === "Split")
                playerPoints = playerPoints + 1;


            // covers pairs of 9's
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "2" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "3" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "4" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "5" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "6" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "7" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "8" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "9" && action === "Split")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "10" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "J" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "Q" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "K" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (playerCards[currentPlayer][0] === "9" && dealerCards[1] === "A" && action === "Stand")
                playerPoints = playerPoints + 1;


            // covers pairs of 10's (or equivalent) (always stand)
            else if ((playerCards[currentPlayer][0] === "10" || playerCards[currentPlayer][0] === "J" ||
                playerCards[currentPlayer][0] === "Q" || playerCards[currentPlayer][0] === "K") && action === "Stand")
                playerPoints = playerPoints + 1;



            // covers pairs of A's (always split)
            else if (playerCards[currentPlayer][0] === "A" && action === "Split")
                playerPoints = playerPoints + 1;

            else
                playerPoints = playerPoints - 1;

        }
        else if (isSoft == 1)
        {
            // soft 12's (always hit)
            if (this.getHandValue(playerCards[currentPlayer]) == 12 && action === "Hit")
                playerPoints = playerPoints + 1;
            

            // soft 13's
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "4" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;
            

            // soft 14's
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "4" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;



            // soft 15's
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // soft 16's
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // soft 17's
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // soft 18's
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "2" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "7" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "8" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // soft 19's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 19 && action === "Stand")
                playerPoints = playerPoints + 1;


            // soft 20's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 20 && action === "Stand")
                playerPoints = playerPoints + 1;


            // soft 21's (always stand (BJ))
            else if (this.getHandValue(playerCards[currentPlayer]) == 21 && action === "Stand")
                playerPoints = playerPoints + 1;

            else
                playerPoints = playerPoints - 1;
        }
        else
        {
            // idk if hard 4's are possible


            // hard 5's (always hit)
            if (this.getHandValue(playerCards[currentPlayer]) == 5 && action === "Hit")
                playerPoints = playerPoints + 1;

            // hard 6's (always hit)
            else if (this.getHandValue(playerCards[currentPlayer]) == 6 && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 7's (always hit)
            else if (this.getHandValue(playerCards[currentPlayer]) == 7 && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 8's (always hit)
            else if (this.getHandValue(playerCards[currentPlayer]) == 8 && action === "Hit")
                playerPoints = playerPoints + 1;
  

            // hard 9's
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 9 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 10's
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "2" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "7" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "8" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "9" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 10 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 11's
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "2" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "3" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "4" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "5" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "6" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "7" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "8" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "9" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "10" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "J" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "Q" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "K" && action === "Double")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 11 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 12's
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "2" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "3" && action === "Hit")
                playerPoints = playerPoints + 1;
            else  if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "4" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "5" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "6" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 12 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 13's
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "2" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "3" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "4" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "5" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "6" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 13 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 14's
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "2" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "3" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "4" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "5" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "6" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 14 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 15's
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "2" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "3" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "4" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "5" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "6" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 15 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 16's
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "2" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "3" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "4" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "5" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "6" && action === "Stand")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "7" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "8" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "9" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "10" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "J" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "Q" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "K" && action === "Hit")
                playerPoints = playerPoints + 1;
            else if (this.getHandValue(playerCards[currentPlayer]) == 16 && dealerCards[1] === "A" && action === "Hit")
                playerPoints = playerPoints + 1;


            // hard 17's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 17 && action === "Stand")
                playerPoints = playerPoints + 1;


            // hard 18's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 18 && action === "Stand")
                playerPoints = playerPoints + 1;


            // hard 19's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 19 && action === "Stand")
                playerPoints = playerPoints + 1;



            // hard 20's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 20 && action === "Stand")
                playerPoints = playerPoints + 1;



            // hard 21's (always stand)
            else if (this.getHandValue(playerCards[currentPlayer]) == 21 && action === "Stand")
                playerPoints = playerPoints + 1;


            else
                playerPoints = playerPoints - 1;
        }
    };

    revealDealerInfo(dealerCards) {

        // updates info on right side based on the dealers faced down card

        if (dealerCards[0] === "A" || dealerCards[0] === "K" || dealerCards[0] === "Q" || 
            dealerCards[0] === "J" || dealerCards[0] === "10")
        {
            runningCount = runningCount - 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else if (dealerCards[0] === "7" || dealerCards[0] === "8" || dealerCards[0] === "9"  )
        {
            runningCount = runningCount;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }
        else
        {
            runningCount = runningCount + 1;
            trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));
            runningCountScoreBoard.setText('Running Count: ' + runningCount);
            trueCountScoreBoard.setText('True Count: ' + trueCount);
        }

 
        dealerCardDisplay.setText("Dealer Cards:\n[" + dealerCards[0] + ", " + dealerCards[1] + "]");


    };

    disableActionButtons(){
        playerHit.disableInteractive();
        playerDouble.disableInteractive();
        playerStand.disableInteractive();
        playerSurrender.disableInteractive();

        playerHit.setTexture('lockedButton');
        playerDouble.setTexture('lockedButton');
        playerStand.setTexture('lockedButton');
        playerSurrender.setTexture('lockedButton');

        playerHit.on('pointerover', function(){
            playerHit.setTexture('lockedButton');
        })

        playerDouble.on('pointerover', function(){
            playerDouble.setTexture('lockedButton');
        })

        playerStand.on('pointerover', function(){
            playerStand.setTexture('lockedButton');
        })

        playerSurrender.on('pointerover', function(){
            playerSurrender.setTexture('lockedButton');
        })

        playerHit.on('pointerout', function(){
            playerHit.setTexture('lockedButton');
        })

        playerDouble.on('pointerout', function(){
            playerDouble.setTexture('lockedButton');
        })

        playerStand.on('pointerout', function(){
            playerStand.setTexture('lockedButton');
        })

        playerSurrender.on('pointerout', function(){
            playerSurrender.setTexture('lockedButton');
        })

        // idk if these below are needed
        playerHit.on('pointerup', function(){
            playerHit.setTexture('lockedButton');
        })

        playerDouble.on('pointerup', function(){
            playerDouble.setTexture('lockedButton');
        })

        playerStand.on('pointerup', function(){
            playerStand.setTexture('lockedButton');
        })

        playerSurrender.on('pointerup', function(){
            playerSurrender.setTexture('lockedButton');
        })
    };

    enableActionButtons(){
        playerHit.setInteractive({ useHandCursor: true });
        playerDouble.setInteractive({ useHandCursor: true });
        playerStand.setInteractive({ useHandCursor: true });
        playerSurrender.setInteractive({ useHandCursor: true});

        playerHit.setTexture('normalButton');
        playerDouble.setTexture('normalButton');
        playerStand.setTexture('normalButton');
        playerSurrender.setTexture('normalButton');

        playerHit.on('pointerover', function(){
            playerHit.setTexture('hoveredButton');
        })

        playerDouble.on('pointerover', function(){
            playerDouble.setTexture('hoveredButton');
        })

        playerStand.on('pointerover', function(){
            playerStand.setTexture('hoveredButton');
        })

        playerSurrender.on('pointerover', function(){
            playerSurrender.setTexture('hoveredButton');
        })

        playerHit.on('pointerout', function(){
            playerHit.setTexture('normalButton');
        })

        playerDouble.on('pointerout', function(){
            playerDouble.setTexture('normalButton');
        })

        playerStand.on('pointerout', function(){
            playerStand.setTexture('normalButton');
        })

        playerSurrender.on('pointerout', function(){
            playerSurrender.setTexture('normalButton');
        })

        // idk if these below are needed
        playerHit.on('pointerup', function(){
            playerHit.setTexture('hoveredButton');
        })

        playerDouble.on('pointerup', function(){
            playerDouble.setTexture('hoveredButton');
        })

        playerStand.on('pointerup', function(){
            playerStand.setTexture('hoveredButton');
        })

        playerSurrender.on('pointerup', function(){
            playerSurrender.setTexture('hoveredButton');
        })
    };

    disableDoubleButton(){

        playerDouble.disableInteractive();

        playerDouble.setTexture('lockedButton');

        playerDouble.on('pointerover', function(){
            playerDouble.setTexture('lockedButton');
        })

        playerDouble.on('pointerout', function(){
            playerDouble.setTexture('lockedButton');
        })

        // idk if these below are needed
        playerDouble.on('pointerup', function(){
            playerDouble.setTexture('lockedButton');
        })

    };

    enableDoubleButton(){

        playerDouble.setInteractive({ useHandCursor: true});

        playerDouble.setTexture('normalButton');

        playerDouble.on('pointerover', function(){
            playerDouble.setTexture('hoveredButton');
        })

        playerDouble.on('pointerout', function(){
            playerDouble.setTexture('normalButton');
        })

        // idk if these below are needed
        playerDouble.on('pointerup', function(){
            playerDouble.setTexture('hoveredButton');
        })
    };

    disableSurrenderButton(){

        playerSurrender.disableInteractive();

        playerSurrender.setTexture('lockedButton');

        playerSurrender.on('pointerover', function(){
            playerSurrender.setTexture('lockedButton');
        })

        playerSurrender.on('pointerout', function(){
            playerSurrender.setTexture('lockedButton');
        })

        // idk if these below are needed
        playerSurrender.on('pointerup', function(){
            playerSurrender.setTexture('lockedButton');
        })
    };

    enableSurrenderButton(){

        playerSurrender.setInteractive({ useHandCursor: true});

        playerSurrender.setTexture('normalButton');

        playerSurrender.on('pointerover', function(){
            playerSurrender.setTexture('hoveredButton');
        })

        playerSurrender.on('pointerout', function(){
            playerSurrender.setTexture('normalButton');
        })

        // idk if these below are needed
        playerSurrender.on('pointerup', function(){
            playerSurrender.setTexture('hoveredButton');
        })
    };

    disableInsuranceButton(){

        playerInsurance.disableInteractive();

        playerInsurance.setTexture('lockedButton');

        playerInsurance.on('pointerover', function(){
            playerInsurance.setTexture('lockedButton');
        })

        playerInsurance.on('pointerout', function(){
            playerInsurance.setTexture('lockedButton');
        })

        // idk if these below are needed
        playerInsurance.on('pointerup', function(){
            playerInsurance.setTexture('lockedButton');
        })
    };

    enableInsuranceButton(){

        playerInsurance.setInteractive({ useHandCursor: true});

        playerInsurance.setTexture('normalButton');

        playerInsurance.on('pointerover', function(){
            playerInsurance.setTexture('hoveredButton');
        })

        playerInsurance.on('pointerout', function(){
            playerInsurance.setTexture('normalButton');
        })

        // idk if these below are needed
        playerInsurance.on('pointerup', function(){
            playerInsurance.setTexture('hoveredButton');
        })
    };

    disableSplitButton(){

        playerSplit.disableInteractive();

        playerSplit.setTexture('lockedButton');

        playerSplit.on('pointerover', function(){
            playerSplit.setTexture('lockedButton');
        })

        playerSplit.on('pointerout', function(){
            playerSplit.setTexture('lockedButton');
        })

        // idk if these below are needed
        playerSplit.on('pointerup', function(){
            playerSplit.setTexture('lockedButton');
        })

    };

    enableSplitButton(){

        playerSplit.setInteractive({ useHandCursor: true});

        playerSplit.setTexture('normalButton');

        playerSplit.on('pointerover', function(){
            playerSplit.setTexture('hoveredButton');
        })

        playerSplit.on('pointerout', function(){
            playerSplit.setTexture('normalButton');
        })

        // idk if these below are needed
        playerSplit.on('pointerup', function(){
            playerSplit.setTexture('hoveredButton');
        })
    };

    disableBettingButtons(){

        whiteChip_1_Button.disableInteractive();
        redChip_5_Button.disableInteractive();
        blueChip_10_Button.disableInteractive();
        greenChip_25_Button.disableInteractive();
        blackChip_100_Button.disableInteractive();

        whiteChip_1_Button.on('pointerover', function(){
            whiteChip_1_Button.scale = .075;
        })

        redChip_5_Button.on('pointerover', function(){
            redChip_5_Button.scale = .075;
        })

        blueChip_10_Button.on('pointerover', function(){
            blueChip_10_Button.scale = .075;
        })

        greenChip_25_Button.on('pointerover', function(){
            greenChip_25_Button.scale = .075;
        })

        blackChip_100_Button.on('pointerover', function(){
            blackChip_100_Button.scale = .075;
        })

        whiteChip_1_Button.on('pointerout', function(){
            whiteChip_1_Button.scale = .075;
        })

        redChip_5_Button.on('pointerout', function(){
            redChip_5_Button.scale = .075;
        })

        blueChip_10_Button.on('pointerout', function(){
            blueChip_10_Button.scale = .075;
        })

        greenChip_25_Button.on('pointerout', function(){
            greenChip_25_Button.scale = .075;
        })

        blackChip_100_Button.on('pointerout', function(){
            blackChip_100_Button.scale = .075;
        })
    };

    enableBettingButtons(){

        whiteChip_1_Button.setInteractive({ useHandCursor: true });
        redChip_5_Button.setInteractive({ useHandCursor: true });
        blueChip_10_Button.setInteractive({ useHandCursor: true });
        greenChip_25_Button.setInteractive({ useHandCursor: true });
        blackChip_100_Button.setInteractive({ useHandCursor: true });

        whiteChip_1_Button.on('pointerover', function(){
            whiteChip_1_Button.scale = .08;
        })

        redChip_5_Button.on('pointerover', function(){
            redChip_5_Button.scale = .08;
        })

        blueChip_10_Button.on('pointerover', function(){
            blueChip_10_Button.scale = .08;
        })

        greenChip_25_Button.on('pointerover', function(){
            greenChip_25_Button.scale = .08;
        })

        blackChip_100_Button.on('pointerover', function(){
            blackChip_100_Button.scale = .08;
        })

        whiteChip_1_Button.on('pointerout', function(){
            whiteChip_1_Button.scale = .075;
        })

        redChip_5_Button.on('pointerout', function(){
            redChip_5_Button.scale = .075;
        })

        blueChip_10_Button.on('pointerout', function(){
            blueChip_10_Button.scale = .075;
        })

        greenChip_25_Button.on('pointerout', function(){
            greenChip_25_Button.scale = .075;
        })

        blackChip_100_Button.on('pointerout', function(){
            blackChip_100_Button.scale = .075;
        })
    };

    disableNextBettorButton(){
        nextBettorButton.disableInteractive();
        nextBettorButton.setTexture('nextBettorButtonLocked');

        nextBettorButton.on('pointerover', function(){
            nextBettorButton.setTexture('nextBettorButtonLocked');
        })

        nextBettorButton.on('pointeron', function(){
            nextBettorButton.setTexture('nextBettorButtonLocked');
        })

        nextBettorButton.on('pointerout', function(){
            nextBettorButton.setTexture('nextBettorButtonLocked');
        })

        nextBettorButton.on('pointerup', function(){
            nextBettorButton.setTexture('nextBettorButtonLocked');
        })
    };

    enableNextBettorButton(){
        nextBettorButton.setInteractive({ useHandCursor: true });
        nextBettorButton.setTexture('nextBettorButtonNormal');

        nextBettorButton.on('pointerover', function(){
            nextBettorButton.setTexture('nextBettorButtonHovered');
        })

        nextBettorButton.on('pointerout', function(){
            nextBettorButton.setTexture('nextBettorButtonNormal');
        })

        nextBettorButton.on('pointerup', function(){
            nextBettorButton.setTexture('nextBettorButtonHovered');
        })
    };

    disableNextRoundButton(){
        nextRoundButton.disableInteractive();
        nextRoundButton.setTexture('nextRoundButtonLocked');

        nextRoundButton.on('pointerover', function(){
            nextRoundButton.setTexture('nextRoundButtonLocked');
        })

        nextRoundButton.on('pointeron', function(){
            nextRoundButton.setTexture('nextRoundButtonLocked');
        })

        nextRoundButton.on('pointerout', function(){
            nextRoundButton.setTexture('nextRoundButtonLocked');
        })

        nextRoundButton.on('pointerup', function(){
            nextRoundButton.setTexture('nextRoundButtonLocked');
        })
    };

    enableNextRoundButton(){
        nextRoundButton.setInteractive({ useHandCursor: true });
        nextRoundButton.setTexture('nextRoundButtonNormal');

        nextRoundButton.on('pointerover', function(){
            nextRoundButton.setTexture('nextRoundButtonHovered');
        })

        nextRoundButton.on('pointerout', function(){
            nextRoundButton.setTexture('nextRoundButtonNormal');
        })

        nextRoundButton.on('pointerup', function(){
            nextRoundButton.setTexture('nextRoundButtonHovered');
        })
    };

    resetBoard() {
        dealerCardDisplay.setText("Dealer Cards: \n");
        if (numPlayers == 1)
        {
            player1CardDisplay.setText("Player1 Cards: \n");
            player1CardDisplay.setTint(0xFFFFFF);
        }
        else if (numPlayers == 2)
        {
            player1CardDisplay.setText("Player1 Cards: \n");
            player2CardDisplay.setText("Player2 Cards: \n");
            player1CardDisplay.setTint(0xFFFFFF);
            player2CardDisplay.setTint(0xFFFFFF);
        }
        else if (numPlayers == 3)
        {
            player1CardDisplay.setText("Player1 Cards: \n");
            player2CardDisplay.setText("Player2 Cards: \n");
            player3CardDisplay.setText("Player3 Cards: \n");
            player1CardDisplay.setTint(0xFFFFFF);
            player2CardDisplay.setTint(0xFFFFFF);
            player3CardDisplay.setTint(0xFFFFFF);
        }

        this.disableNextRoundButton();

        dealerCard.setPosition(900, 75);
        dealerCard.visible = true;

        playerCards = [[], [], []];
        dealerCards = [];
        didPlayersSurrender = [0, 0, 0];

        // destroy sprites
        for (let i = 0; i < cardIndex; i++)
        {
            // shuffledDeck[cardInts[i]].visible = false;
            // shuffledDeck[cardInts[i]].setPosition(900, 75);
            shuffledDeck[cardInts[i]].destroy(true);
        }

        // destroy chips as well
        for (let i = 0; i < player1ChipCount.length; i++)
        {
            player1ChipCount[i].destroy(true);
        }

        for (let i = 0; i < player2ChipCount.length; i++)
        {
            player2ChipCount[i].destroy(true);
        }

        for (let i = 0; i < player3ChipCount.length; i++)
        {
            player3ChipCount[i].destroy(true);
        }

        for (let i = 0; i < player1DoubleChipCount.length; i++)
        {
            player1DoubleChipCount[i].destroy(true);
        }

        for (let i = 0; i < player2DoubleChipCount.length; i++)
        {
            player2DoubleChipCount[i].destroy(true);
        }

        for (let i = 0; i < player3DoubleChipCount.length; i++)
        {
            player3DoubleChipCount[i].destroy(true);
        }

        for (let i = 0; i < player1InsuranceChips.length; i++)
        {
            player1InsuranceChips[i].destroy(true);
        }

        for (let i = 0; i < player2InsuranceChips.length; i++)
        {
            player2InsuranceChips[i].destroy(true);
        }

        for (let i = 0; i < player3InsuranceChips.length; i++)
        {
            player3InsuranceChips[i].destroy(true);
        }

        player1Bet = 0;
        player2Bet = 0;
        player3Bet = 0;
        player1InsuranceBet = 0;
        player2InsuranceBet = 0;
        player3InsuranceBet = 0;
        player1ChipCount = [];
        player2ChipCount = [];
        player3ChipCount = [];
        player1DoubleChipCount = [];
        player2DoubleChipCount = [];
        player3DoubleChipCount = [];
        player1InsuranceChips = [];
        player2InsuranceChips = [];
        player3InsuranceChips = [];
        didPlayersSurrender = [0, 0, 0];
        isPlayerInsured = [0, 0, 0];
        numChips = 0;
        currentBet = 0;
    };

    newRound() {

        this.disableActionButtons();
        this.disableBettingButtons();
        this.disableNextRoundButton();
        this.disableNextBettorButton();

        var timeline = this.tweens.createTimeline();
        
        // i = card
        // j = player
        for (let i = 0; i < 2; i++)
        {
            for (let j = 0; j < numPlayers; j++)
            {
                playerCards[j][i] = (this.getValue(cardInts, cardIndex));
                this.dealCard(cardInts[cardIndex], shuffledDeck, timeline, i, j, 0, dealerCard);

                cardIndex++;
            }

            // deals to the dealer
            dealerCards[i] = (this.getValue(cardInts, cardIndex));

            // console.log(dealerCards[i]);
            if (i == 0)
            {
                this.dealCard(cardInts[cardIndex], shuffledDeck, timeline, i, 3, 1, dealerCard);
                dealerIndex = cardIndex;
                shuffledDeck[cardInts[dealerIndex]].setPosition(cardX[0][3], cardY[0][3]);
                shuffledDeck[cardInts[dealerIndex]].setDepth(-1);
            }
            else
            {
                this.dealCard(cardInts[cardIndex], shuffledDeck, timeline, i, 3, 0, dealerCard);
            }

            cardIndex++;
        }
        
        timeline.play();

        // works
        timeline.addListener("complete", function(){
            //Do something when tweens are complete

            // activate the buttons
            this.enableActionButtons();

            // check if any players have blackjack
            for (let i = 0; i < numPlayers; i++)
            {
                if (this.isBlackjack(playerCards[i]))
                {
                    if (i == 0)
                    {
                        player1CardDisplay.setTint(0xFFD700);
                    }
                    else if (i == 1)
                    {  
                        player2CardDisplay.setTint(0xFFD700);
                    }
                    else if (i == 2)
                    {
                        player3CardDisplay.setTint(0xFFD700);
                    }
                }
            }

            // check if dealers upcard is an Ace
            if (dealerCards[1] === "A")
            {
                if (playerCurrency >= player1Bet * .5)
                    this.enableInsuranceButton();
            } 

            if (playerCurrency >= player1Bet)
                this.enableDoubleButton();
            else
                this.disableDoubleButton();

        }, this);

    };

    // Load assets
    preload() {

        // load background and other assets
        this.load.image('background', '/static/assets/table_layout1.png');
        this.load.image('face_down_card', '/static/assets/card_back.png');

        // action buttons
        this.load.image('normalButton', '/static/assets/normalButton.png');
        this.load.image('hoveredButton', '/static/assets/hoveredButton.png');
        this.load.image('clickedButton', '/static/assets/clickedButton.png');
        this.load.image('lockedButton', '/static/assets/lockedButton.png');

        this.load.image('nextRoundButtonNormal', '/static/assets/nextRoundButtonNormal.png');
        this.load.image('nextRoundButtonLocked', '/static/assets/nextRoundButtonLocked.png');
        this.load.image('nextRoundButtonClicked', '/static/assets/nextRoundButtonClicked.png');
        this.load.image('nextRoundButtonHovered', '/static/assets/nextRoundButtonHovered.png');

        this.load.image('nextBettorButtonNormal', '/static/assets/nextBettorButtonNormal.png');
        this.load.image('nextBettorButtonLocked', '/static/assets/nextBettorButtonLocked.png');
        this.load.image('nextBettorButtonClicked', '/static/assets/nextBettorButtonClicked.png');
        this.load.image('nextBettorButtonHovered', '/static/assets/nextBettorButtonHovered.png');

        // chips
        this.load.image('half_chip', '/static/assets/half_chip.png');
        this.load.image('chip_1', '/static/assets/1Chip.png');
        this.load.image('chip_1_angle', '/static/assets/1ChipAngle.png');
        this.load.image('chip_5', '/static/assets/5Chip.png');
        this.load.image('chip_5_angle', '/static/assets/5ChipAngle.png');
        this.load.image('chip_10', '/static/assets/10Chip.png');
        this.load.image('chip_10_angle', '/static/assets/10ChipAngle.png');
        this.load.image('chip_25', '/static/assets/25Chip.png');
        this.load.image('chip_25_angle', '/static/assets/25ChipAngle.png');
        this.load.image('chip_100', '/static/assets/100Chip.png');
        this.load.image('chip_100_angle', '/static/assets/100ChipAngle.png');

        // playing card spritesheet
        this.load.spritesheet("cards", "/static/assets/classicCards.png", {
            frameWidth: gameOptions.cardWidth,
            frameHeight: gameOptions.cardHeight
        });

        this.load.spritesheet('shufflingAnim', "/static/assets/Shuffling.png", {
            frameWidth: 822, 
            frameHeight: 850,
        });
    };

    // called a single time after preload ends
    create() {

        // places the background
        bg = this.add.image(0, 0, 'background');
        bg.scale = .75;
        bg.setPosition(1400/2, 740/2);

        // displays info on the top right side of canvas
        currencyScoreBoard = this.add.text(1175, 25, "Currency: $" + playerCurrency, {fontSize: '20px', fill: '#fff'});
        pointScoreBoard = this.add.text(1175, 50, "Points: " + playerPoints, {fontSize: '20px', fill: '#fff'});
        runningCountScoreBoard = this.add.text(1175, 75, "Running Count: 0", {fontSize: '20px', fill: '#fff'});
        trueCountScoreBoard = this.add.text(1175, 100, "True Count: 0", {fontSize: '20px', fill: '#fff'});
        // dealerCardDisplay = this.add.text(1175, 125, "Dealer Cards: \n", {fontSize: '20px', fill: '#fff'});
        dealerCardDisplay = this.add.text(25, 125, "Dealer Cards: \n", {fontSize: '20px', fill: '#fff'});

        if (numPlayers == 1)
        {
            // player1CardDisplay = this.add.text(1175, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player1CardDisplay = this.add.text(25, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
        }
        else if(numPlayers == 2)
        {
            // player1CardDisplay = this.add.text(1175, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
            // player2CardDisplay = this.add.text(1175, 325, "Player2 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player1CardDisplay = this.add.text(25, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player2CardDisplay = this.add.text(25, 325, "Player2 Cards: \n", {fontSize: '20px', fill: '#fff'});
        }
        else if (numPlayers == 3)
        {
            // player1CardDisplay = this.add.text(1175, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
            // player2CardDisplay = this.add.text(1175, 325, "Player2 Cards: \n", {fontSize: '20px', fill: '#fff'});
            // player3CardDisplay = this.add.text(1175, 425, "Player3 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player1CardDisplay = this.add.text(25, 225, "Player1 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player2CardDisplay = this.add.text(25, 325, "Player2 Cards: \n", {fontSize: '20px', fill: '#fff'});
            player3CardDisplay = this.add.text(25, 425, "Player3 Cards: \n", {fontSize: '20px', fill: '#fff'});
        }

        // places controlPanel
        controlPanel = this.add.rectangle(700, 875, 1400, 275, 0x008b8b);

        // gets a shuffled deck
        //shuffledDeck = this.initializeDeck(numDecks);
        // cardInts = this.shuffleInts(numDecks);

        this.initializeDeck(numDecks);
        this.shuffleInts(numDecks);

        dealerCard = this.add.image(900, 75, 'face_down_card');
        dealerCard.scale = .14;

        // places deck on table, will get replaced by boot later on
        deck = this.add.image(900, 75, 'face_down_card');
        deck.scale = .14;
        deck.setDepth(1000000);

        // places betting buttons
        whiteChip_1_Button = this.add.image(500, 925, 'chip_1');
        whiteChip_1_Button.scale = .075;
        redChip_5_Button = this.add.image(600, 925, 'chip_5');
        redChip_5_Button.scale = .075;
        blueChip_10_Button = this.add.image(700, 925, 'chip_10');
        blueChip_10_Button.scale = .075;
        greenChip_25_Button = this.add.image(800, 925, 'chip_25');
        greenChip_25_Button.scale = .075;
        blackChip_100_Button = this.add.image(900, 925, 'chip_100');
        blackChip_100_Button.scale = .075;

        // places next round button
        nextRoundButton = this.add.image(1000, 925, 'nextRoundButtonLocked');
        nextRoundButton.scale = 1.25;

        // places next bettor button
        nextBettorButton = this.add.image(400, 925, 'nextBettorButtonNormal');
        nextBettorButton.scale = 1.25;

        this.disableNextRoundButton();
        this.disableNextBettorButton();

        // placing player turn indicators
        player3TurnIndicator = this.add.circle(450, 775, 15, 0xFFFFFF);
        player2TurnIndicator = this.add.circle(700, 775, 15, 0xFFFFFF);
        player1TurnIndicator = this.add.circle(950, 775, 15, 0x8E1600);


        // placing player action buttons
        playerHit = this.add.sprite(200, 845, 'lockedButton');
        playerHit.scale = 2;
        hitText = this.add.text(185, 830, "Hit", textStyle);

        playerDouble = this.add.sprite(400, 845, 'lockedButton');
        playerDouble.scale = 2;
        doubleText = this.add.text(363, 830, "Double", textStyle);

        playerStand = this.add.sprite(600, 845, 'lockedButton');
        playerStand.scale = 2;
        standText = this.add.text(568, 830, "Stand", textStyle);

        playerSurrender = this.add.sprite(800, 845, 'lockedButton');
        playerSurrender.scale = 2;
        surrenderText = this.add.text(748, 830, "Surrender", textStyle);

        playerInsurance = this.add.sprite(1000, 845, 'lockedButton');
        playerInsurance.scale = 2;
        insuranceText = this.add.text(948, 830, "Insurance", textStyle);

        playerSplit = this.add.sprite(1200, 845, 'lockedButton');
        playerSplit.scale = 2;
        splitText = this.add.text(1178, 830, "Split", textStyle);

        // places gambling warning
        //let gamblingWarning = this.add.graphics();
        //gamblingWarning.fillStyle(0xFFFFFF, 1);
        //gamblingWarning.fillRoundedRect(350, 100, 700, 500, 32);
        //gamblingWarning.setDepth(100000);

        // WIP Disclaimer
        disclaimer = this.add.text(25, 25, "Work In Progress", {fontSize: '20px', fill: '#fff'});

        shuffleAnimation = this.add.sprite(700, 300, 'shufflingAnim');
        shuffleAnimation.scale = .2;
        shuffleAnimation.visible = false;

        // math and game logic starts here

        trueCount = Math.floor(runningCount / Math.ceil((numDecks * 52 - cardIndex) / 52));

        // this.newRound();
       
        // 1. check if player has bj or is bust
        // 2. if bj, perform appropriate actions
        // 3. if bust, perform appropriate actions
        // 4. if neither, let player play an action
        // 5. then repeat steps 1-4 
        // 6. then move to next player

        // i = card
        // j = player

        currentPlayer = 0;
        numChips = 0;
        currentBet = 0;
        player1Bet = 0;
        player2Bet = 0;
        player3Bet = 0;
        player1InsuranceBet = 0;
        player2InsuranceBet = 0;
        player3InsuranceBet = 0;
        player1ChipCount = [];
        player2ChipCount = [];
        player3ChipCount = [];

        // add bet
        // subtract currency
        // updateinfo()
        // place chip on table
        // make calculations for where the next chip will go
        // enable action buttons


        this.enableBettingButtons();

        nextBettorButton.on('pointerdown', function(){
            nextBettorButton.setTexture('nextBettorButtonClicked');

            // allow to move to next player only after current players bet surpasses minbet
            if (currentPlayer == 0)
            {
                if (numPlayers != 1)
                {
                    player1TurnIndicator.fillColor = 0xFFFFFF;
                    player2TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;
                    player1Bet = currentBet;
                    this.scene.enableBettingButtons();
                }
                else
                {
                    // plus more stuff since if its the last player
                    player1Bet = currentBet;
                    this.scene.newRound();
                }
            }
            else if (currentPlayer == 1)
            {
                if (numPlayers != 2)
                {
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player3TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;
                    player2Bet = currentBet;
                    this.scene.enableBettingButtons();
                }
                else
                {
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player1TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = 0;
                    player2Bet = currentBet;
                    this.scene.newRound();
                }
            }
            else if (currentPlayer == 2)
            {
                player3TurnIndicator.fillColor = 0xFFFFFF;
                player1TurnIndicator.fillColor = 0x8E1600;
                currentPlayer = 0;
                player3Bet = currentBet;
                this.scene.newRound();
            }

            currentBet = 0;
            numChips = 0;
            this.scene.disableNextBettorButton();
            // this.scene.enableBettingButtons();
        });

        whiteChip_1_Button.on('pointerdown', function(){

            if (!(currentBet + 1 > maxBet) && (playerCurrency - 1 > 0))
            {
                currentBet = currentBet + 1;
                playerCurrency = playerCurrency - 1;
                updateInfo();
                if (currentPlayer == 0)
                {
                    player1ChipCount[numChips] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_1');
                    player1ChipCount[numChips].scale = .075;
                    player1ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 1)
                {
                    player2ChipCount[numChips] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_1');
                    player2ChipCount[numChips].scale = .075;
                    player2ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 2)
                {
                    player3ChipCount[numChips] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_1');
                    player3ChipCount[numChips].scale = .075;
                    player3ChipCount[numChips].setDepth(100 + numChips);
                }
                numChips = numChips + 1;
            }

            // make loop that finds highest value chips 
            
            placeholderBet = currentBet;
            var k = 0;

            if (currentPlayer == 0)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1ChipCount.length; i++)
                    {
                        player1ChipCount[i].destroy(true);
                    }

                    numChips = player1ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2ChipCount.length; i++)
                    {
                        player2ChipCount[i].destroy(true);
                    }

                    numChips = player2ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3ChipCount.length; i++)
                    {
                        player3ChipCount[i].destroy(true);
                    }

                    numChips = player3ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }

            if (currentBet >= minBet)
            {
                this.scene.enableNextBettorButton();
            }
        });

        redChip_5_Button.on('pointerdown', function(){

            if (!(currentBet + 5 > maxBet) && (playerCurrency - 5 > 0))
            {
                currentBet = currentBet + 5;
                playerCurrency = playerCurrency - 5;
                updateInfo();
                if (currentPlayer == 0)
                {
                    player1ChipCount[numChips] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_5');
                    player1ChipCount[numChips].scale = .075;
                    player1ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 1)
                {
                    player2ChipCount[numChips] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_5');
                    player2ChipCount[numChips].scale = .075;
                    player2ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 2)
                {
                    player3ChipCount[numChips] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_5');
                    player3ChipCount[numChips].scale = .075;
                    player3ChipCount[numChips].setDepth(100 + numChips);
                }
                numChips = numChips + 1;
            }

            placeholderBet = currentBet;
            var k = 0;

            if (currentPlayer == 0)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1ChipCount.length; i++)
                    {
                        player1ChipCount[i].destroy(true);
                    }

                    numChips = player1ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2ChipCount.length; i++)
                    {
                        player2ChipCount[i].destroy(true);
                    }

                    numChips = player2ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3ChipCount.length; i++)
                    {
                        player3ChipCount[i].destroy(true);
                    }

                    numChips = player3ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }

            if (currentBet >= minBet)
            {
                this.scene.enableNextBettorButton();
            }
        });

        blueChip_10_Button.on('pointerdown', function(){

            if (!(currentBet + 10 > maxBet) && (playerCurrency - 10 > 0))
            {
                currentBet = currentBet + 10;
                playerCurrency = playerCurrency - 10;
                updateInfo();
                if (currentPlayer == 0)
                {
                    player1ChipCount[numChips] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_10');
                    player1ChipCount[numChips].scale = .075;
                    player1ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 1)
                {
                    player2ChipCount[numChips] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_10');
                    player2ChipCount[numChips].scale = .075;
                    player2ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 2)
                {
                    player3ChipCount[numChips] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_10');
                    player3ChipCount[numChips].scale = .075;
                    player3ChipCount[numChips].setDepth(100 + numChips);
                }
                numChips = numChips + 1;
            }

            placeholderBet = currentBet;
            var k = 0;

            if (currentPlayer == 0)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1ChipCount.length; i++)
                    {
                        player1ChipCount[i].destroy(true);
                    }

                    numChips = player1ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2ChipCount.length; i++)
                    {
                        player2ChipCount[i].destroy(true);
                    }

                    numChips = player2ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3ChipCount.length; i++)
                    {
                        player3ChipCount[i].destroy(true);
                    }

                    numChips = player3ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }

            if (currentBet >= minBet)
            {
                this.scene.enableNextBettorButton();
            }
        });

        greenChip_25_Button.on('pointerdown', function(){

            if (!(currentBet + 25 > maxBet) && (playerCurrency - 25 > 0))
            {
                currentBet = currentBet + 25;
                playerCurrency = playerCurrency - 25;
                updateInfo();
                if (currentPlayer == 0)
                {
                    player1ChipCount[numChips] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_25');
                    player1ChipCount[numChips].scale = .075;
                    player1ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 1)
                {
                    player2ChipCount[numChips] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_25');
                    player2ChipCount[numChips].scale = .075;
                    player2ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 2)
                {
                    player3ChipCount[numChips] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_25');
                    player3ChipCount[numChips].scale = .075;
                    player3ChipCount[numChips].setDepth(100 + numChips);
                }
                numChips = numChips + 1;
            }

            placeholderBet = currentBet;
            var k = 0;

            if (currentPlayer == 0)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1ChipCount.length; i++)
                    {
                        player1ChipCount[i].destroy(true);
                    }

                    numChips = player1ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2ChipCount.length; i++)
                    {
                        player2ChipCount[i].destroy(true);
                    }

                    numChips = player2ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3ChipCount.length; i++)
                    {
                        player3ChipCount[i].destroy(true);
                    }

                    numChips = player3ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }           

            if (currentBet >= minBet)
            {
                this.scene.enableNextBettorButton();
            }
        });

        blackChip_100_Button.on('pointerdown', function(){

            if (!(currentBet + 100 > maxBet) && (playerCurrency - 100 > 0))
            {
                currentBet = currentBet + 100;
                playerCurrency = playerCurrency - 100;
                updateInfo();
                if (currentPlayer == 0)
                {
                    player1ChipCount[numChips] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_100');
                    player1ChipCount[numChips].scale = .075;
                    player1ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 1)
                {
                    player2ChipCount[numChips] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_100');
                    player2ChipCount[numChips].scale = .075;
                    player2ChipCount[numChips].setDepth(100 + numChips);
                }
                else if (currentPlayer == 2)
                {
                    player3ChipCount[numChips] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (numChips * 5), 'chip_100');
                    player3ChipCount[numChips].scale = .075;
                    player3ChipCount[numChips].setDepth(100 + numChips);
                }
                numChips = numChips + 1;
            }

            placeholderBet = currentBet;
            var k = 0;

            if (currentPlayer == 0)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1ChipCount.length; i++)
                    {
                        player1ChipCount[i].destroy(true);
                    }

                    numChips = player1ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1ChipCount = placeholderChipArray;
                        numChips = player1ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2ChipCount.length; i++)
                    {
                        player2ChipCount[i].destroy(true);
                    }

                    numChips = player2ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2ChipCount = placeholderChipArray;
                        numChips = player2ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3ChipCount.length; i++)
                    {
                        player3ChipCount[i].destroy(true);
                    }

                    numChips = player3ChipCount.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords, playerChipYCoords - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3ChipCount = placeholderChipArray;
                        numChips = player3ChipCount.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }

            if (currentBet >= minBet)
            {
                this.scene.enableNextBettorButton();
            }
        });

        // player chooses to hit
        playerHit.on('pointerdown', function(){

            if(!this.scene.isBust(playerCards[currentPlayer]))
            {
                playerHit.setTexture('clickedButton');
                // ADDING THIS NEW LINE RIGHT HERE BELOW THIS COMMENT
                this.scene.baseGameBasicStrategy(currentPlayer, "Hit");
                playerCards[currentPlayer][playerCards[currentPlayer].length] = (this.scene.getValue(cardInts, cardIndex, this));
                this.scene.hitCard(cardInts[cardIndex], shuffledDeck, playerCards[currentPlayer].length-1, currentPlayer, this);
                cardIndex++;

                this.scene.disableSurrenderButton();
                this.scene.disableDoubleButton();
                this.scene.disableInsuranceButton();
                // playerCards[currentPlayer][playerCards[currentPlayer].length + 1]
                // to dynamically hit cards

                if (currentPlayer == 0)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player1CardDisplay.setTint(0xFFFFFF);
                    }
                }
                else if (currentPlayer == 1)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player2CardDisplay.setTint(0xFFFFFF);
                    }
                }
                else if (currentPlayer == 2)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player3CardDisplay.setTint(0xFFFFFF);
                    }
                }
                
                if (this.scene.isBust(playerCards[currentPlayer]))
                {
                    if (currentPlayer == 0)
                    {
                        if (numPlayers != 1)
                        {
                            player1TurnIndicator.fillColor = 0xFFFFFF;
                            player2TurnIndicator.fillColor = 0x8E1600;
                            currentPlayer = currentPlayer + 1;
                            this.scene.enableSurrenderButton();

                            if (playerCurrency >= player2Bet)
                                this.scene.enableDoubleButton();
                            else
                                this.scene.disableDoubleButton();

                            if (playerCurrency >= player2Bet * .5 && dealerCards[1] === "A")
                                this.scene.enableInsuranceButton();
                            else
                                this.scene.disableInsuranceButton();
                        }
                        else
                        {
                            // plus more stuff since if its the last player
                            dealerCard.visible = false;
                            shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                            this.scene.revealDealerInfo(dealerCards);
                            // dealer needs to draw to 16, and stand on 17
                            this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                            cardIndex = cardIndex + dealerCards.length - 2;
                            this.scene.isWinOrLoss();
                            this.scene.disableActionButtons();
                            this.scene.disableInsuranceButton();
                            this.scene.disableSplitButton();
                        }
                    }
                    else if (currentPlayer == 1)
                    {
                        if (numPlayers != 2)
                        {
                            player2TurnIndicator.fillColor = 0xFFFFFF;
                            player3TurnIndicator.fillColor = 0x8E1600;
                            currentPlayer = currentPlayer + 1;
                            this.scene.enableSurrenderButton();

                            if (playerCurrency >= player3Bet)
                                this.scene.enableDoubleButton();
                            else
                                this.scene.disableDoubleButton();

                            if (playerCurrency >= player3Bet * .5 && dealerCards[1] === "A")
                                this.scene.enableInsuranceButton();
                            else
                                this.scene.disableInsuranceButton();
                        }
                        else
                        {
                            player2TurnIndicator.fillColor = 0xFFFFFF;
                            player1TurnIndicator.fillColor = 0x8E1600;
                            currentPlayer = 0;

                            // plus more stuff since if its the last player
                            dealerCard.visible = false;
                            shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                            this.scene.revealDealerInfo(dealerCards);
                            // dealer needs to draw to 16, and stand on 17
                            this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                            cardIndex = cardIndex + dealerCards.length - 2;
                            this.scene.isWinOrLoss();
                            this.scene.disableActionButtons();
                            this.scene.disableInsuranceButton();
                            this.scene.disableSplitButton();
                        }
                    }
                    else if (currentPlayer == 2)
                    {
                        player3TurnIndicator.fillColor = 0xFFFFFF;
                        player1TurnIndicator.fillColor = 0x8E1600;
                        currentPlayer = 0;

                        // plus more stuff since if its the last player
                        dealerCard.visible = false;
                        shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                        this.scene.revealDealerInfo(dealerCards);
                        // dealer needs to draw to 16, and stand on 17
                        this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                        cardIndex = cardIndex + dealerCards.length - 2;
                        this.scene.isWinOrLoss();
                        this.scene.disableActionButtons();
                        this.scene.disableInsuranceButton();
                        this.scene.disableSplitButton();
                    }
                }

            }

        });

        // player chooses to double
        playerDouble.on('pointerdown', function(){

            if(!this.scene.isBust(playerCards[currentPlayer]))
            {
                playerDouble.setTexture('clickedButton');
                // ADDING THIS NEW LINE RIGHT HERE BELOW THIS COMMENT
                this.scene.baseGameBasicStrategy(currentPlayer, "Double");
                playerCards[currentPlayer][playerCards[currentPlayer].length] = (this.scene.getValue(cardInts, cardIndex, this));
                this.scene.hitCard(cardInts[cardIndex], shuffledDeck, playerCards[currentPlayer].length-1, currentPlayer, this);
                cardIndex++;

                // playerCards[currentPlayer][playerCards[currentPlayer].length + 1]
                // to dynamically hit cards

                if (currentPlayer == 0)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player1CardDisplay.setTint(0xFFFFFF);
                    }
                }
                else if (currentPlayer == 1)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player2CardDisplay.setTint(0xFFFFFF);
                    }
                }
                else if (currentPlayer == 2)
                {
                    if (this.scene.isBlackjack(playerCards[currentPlayer]) == 0 && this.scene.isBust(playerCards[currentPlayer]) == 0 && didPlayersSurrender[currentPlayer] == 0)
                    {
                        player3CardDisplay.setTint(0xFFFFFF);
                    }
                }

                // since this is a double, player can only hit once and their turn is over
                // still need to implement the duplicating chips
                if (currentPlayer == 0)
                {
                    placeholderBet = player1Bet;
                    playerCurrency = playerCurrency - player1Bet;
                    var k = 0;
        
                    while (placeholderBet > 0)
                    {
                        for (let i = 0; i < player1DoubleChipCount.length; i++)
                        {
                            player1DoubleChipCount[i].destroy(true);
                        }
    
                        numChips = player1DoubleChipCount.length;
    
                        while (placeholderBet - 100 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 100;
    
                            player1DoubleChipCount = placeholderChipArray;
                            numChips = player1DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 25 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 25;
    
                            player1DoubleChipCount = placeholderChipArray;
                            numChips = player1DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 10 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 10;
    
                            player1DoubleChipCount = placeholderChipArray;
                            numChips = player1DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 5 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 5;
    
                            player1DoubleChipCount = placeholderChipArray;
                            numChips = player1DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 1 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 1;
    
                            player1DoubleChipCount = placeholderChipArray;
                            numChips = player1DoubleChipCount.length;
                            k++;
                        }
                    }
                    placeholderChipArray = [];

                    player1Bet = player1Bet * 2;

                    if (numPlayers != 1)
                    {
                        player1TurnIndicator.fillColor = 0xFFFFFF;
                        player2TurnIndicator.fillColor = 0x8E1600;
                        currentPlayer = currentPlayer + 1;
                        this.scene.enableSurrenderButton();

                        if (playerCurrency >= player2Bet)
                            this.scene.enableDoubleButton();
                        else
                            this.scene.disableDoubleButton();

                        if (playerCurrency >= player2Bet * .5 && dealerCards[1] === "A")
                            this.scene.enableInsuranceButton();
                        else
                            this.scene.disableInsuranceButton();
                    }
                    else
                    {
                        // plus more stuff since if its the last player
                        dealerCard.visible = false;
                        shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                        this.scene.revealDealerInfo(dealerCards);
                        // dealer needs to draw to 16, and stand on 17
                        this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                        cardIndex = cardIndex + dealerCards.length - 2;
                        this.scene.isWinOrLoss();
                        this.scene.disableActionButtons();
                        this.scene.disableInsuranceButton();
                        this.scene.disableSplitButton();
                    }
                }
                else if (currentPlayer == 1)
                {

                    placeholderBet = player2Bet;
                    playerCurrency = playerCurrency - player2Bet;
                    var k = 0;
        
                    while (placeholderBet > 0)
                    {
                        for (let i = 0; i < player2DoubleChipCount.length; i++)
                        {
                            player2DoubleChipCount[i].destroy(true);
                        }
    
                        numChips = player2DoubleChipCount.length;
    
                        while (placeholderBet - 100 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 100;
    
                            player2DoubleChipCount = placeholderChipArray;
                            numChips = player2DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 25 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 25;
    
                            player2DoubleChipCount = placeholderChipArray;
                            numChips = player2DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 10 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 10;
    
                            player2DoubleChipCount = placeholderChipArray;
                            numChips = player2DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 5 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 5;
    
                            player2DoubleChipCount = placeholderChipArray;
                            numChips = player2DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 1 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 1;
    
                            player2DoubleChipCount = placeholderChipArray;
                            numChips = player2DoubleChipCount.length;
                            k++;
                        }
                    }
                    placeholderChipArray = [];

                    player2Bet = player2Bet * 2;

                    if (numPlayers != 2)
                    {
                        player2TurnIndicator.fillColor = 0xFFFFFF;
                        player3TurnIndicator.fillColor = 0x8E1600;
                        currentPlayer = currentPlayer + 1;
                        this.scene.enableSurrenderButton();

                        if (playerCurrency >= player3Bet)
                            this.scene.enableDoubleButton();
                        else
                            this.scene.disableDoubleButton();

                        if (playerCurrency >= player3Bet * .5 && dealerCards[1] === "A")
                            this.scene.enableInsuranceButton();
                        else
                            this.scene.disableInsuranceButton();
                    }
                    else
                    {
                        player2TurnIndicator.fillColor = 0xFFFFFF;
                        player1TurnIndicator.fillColor = 0x8E1600;
                        currentPlayer = 0;

                        // plus more stuff since if its the last player
                        dealerCard.visible = false;
                        shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                        this.scene.revealDealerInfo(dealerCards);
                        // dealer needs to draw to 16, and stand on 17
                        this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                        cardIndex = cardIndex + dealerCards.length - 2;
                        this.scene.isWinOrLoss();
                        this.scene.disableActionButtons();
                        this.scene.disableInsuranceButton();
                        this.scene.disableSplitButton();
                    }
                }
                else if (currentPlayer == 2)
                {

                    placeholderBet = player3Bet;
                    playerCurrency = playerCurrency - player3Bet;
                    var k = 0;
        
                    while (placeholderBet > 0)
                    {
                        for (let i = 0; i < player3DoubleChipCount.length; i++)
                        {
                            player3DoubleChipCount[i].destroy(true);
                        }
    
                        numChips = player3DoubleChipCount.length;
    
                        while (placeholderBet - 100 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 100;
    
                            player3DoubleChipCount = placeholderChipArray;
                            numChips = player3DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 25 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 25;
    
                            player3DoubleChipCount = placeholderChipArray;
                            numChips = player3DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 10 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 10;
    
                            player3DoubleChipCount = placeholderChipArray;
                            numChips = player3DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 5 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 5;
    
                            player3DoubleChipCount = placeholderChipArray;
                            numChips = player3DoubleChipCount.length;
                            k++;
                        }
    
                        while (placeholderBet - 1 >= 0)
                        {
                            placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords + 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                            placeholderChipArray[k].scale = .075;
                            placeholderChipArray[k].setDepth(100 + k);
                            placeholderBet = placeholderBet - 1;
    
                            player3DoubleChipCount = placeholderChipArray;
                            numChips = player3DoubleChipCount.length;
                            k++;
                        }
                    }
                    placeholderChipArray = [];

                    player3Bet = player3Bet * 2;

                    player3TurnIndicator.fillColor = 0xFFFFFF;
                    player1TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = 0;

                    // plus more stuff since if its the last player
                    dealerCard.visible = false;
                    shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                    this.scene.revealDealerInfo(dealerCards);
                    // dealer needs to draw to 16, and stand on 17
                    this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                    cardIndex = cardIndex + dealerCards.length - 2;
                    this.scene.isWinOrLoss();
                    this.scene.disableActionButtons();
                    this.scene.disableInsuranceButton();
                    this.scene.disableSplitButton();
                }

            }
        });

        // player chooses to stand
        playerStand.on('pointerdown', function(){

            playerStand.setTexture('clickedButton');
            // ADDING THIS NEW LINE RIGHT HERE BELOW THIS COMMENT
            this.scene.baseGameBasicStrategy(currentPlayer, "Stand");
            updateInfo();

            if (currentPlayer == 0)
            {
                if (numPlayers != 1)
                {
                    player1TurnIndicator.fillColor = 0xFFFFFF;
                    player2TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;
                    this.scene.enableSurrenderButton();

                    if (playerCurrency >= player2Bet)
                        this.scene.enableDoubleButton();
                    else
                        this.scene.disableDoubleButton();

                    if (playerCurrency >= player2Bet * .5 && dealerCards[1] === "A")
                        this.scene.enableInsuranceButton();
                    else
                        this.scene.disableInsuranceButton();
                }
                else
                {
                    // plus more stuff since if its the last player
                    dealerCard.visible = false;
                    shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                    this.scene.revealDealerInfo(dealerCards);
                    // dealer needs to draw to 16, and stand on 17
                    this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                    cardIndex = cardIndex + dealerCards.length - 2;
                    this.scene.isWinOrLoss();
                    this.scene.disableActionButtons();
                    this.scene.disableInsuranceButton();
                    this.scene.disableSplitButton();
                }
            }
            else if (currentPlayer == 1)
            {
                if (numPlayers != 2)
                {
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player3TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;
                    this.scene.enableSurrenderButton();

                    if (playerCurrency >= player3Bet)
                        this.scene.enableDoubleButton();
                    else
                        this.scene.disableDoubleButton();

                    if (playerCurrency >= player3Bet * .5 && dealerCards[1] === "A")
                        this.scene.enableInsuranceButton();
                    else
                        this.scene.disableInsuranceButton();
                }
                else
                {
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player1TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = 0;

                    dealerCard.visible = false;
                    shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                    this.scene.revealDealerInfo(dealerCards);
                    // dealer needs to draw to 16, and stand on 17
                    this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                    cardIndex = cardIndex + dealerCards.length - 2;
                    this.scene.isWinOrLoss();
                    this.scene.disableActionButtons();
                    this.scene.disableInsuranceButton();
                    this.scene.disableSplitButton();
                }
            }
            else if (currentPlayer == 2)
            {
                player3TurnIndicator.fillColor = 0xFFFFFF;
                player1TurnIndicator.fillColor = 0x8E1600;
                currentPlayer = 0;
                dealerCard.visible = false;
                shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                this.scene.revealDealerInfo(dealerCards);
                // dealer needs to draw to 16, and stand on 17
                this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                cardIndex = cardIndex + dealerCards.length - 2;
                this.scene.isWinOrLoss();
                this.scene.disableActionButtons();
                this.scene.disableInsuranceButton();
                this.scene.disableSplitButton();
            }
        });

        // player chooses to surrender
        playerSurrender.on('pointerdown', function(){

            playerSurrender.setTexture('clickedButton');

            if (currentPlayer == 0)
            {
                if (numPlayers != 1)
                {
                    playerCurrency = playerCurrency + (.5 * player1Bet);
                    didPlayersSurrender[0] = 1;
                    player1CardDisplay.setTint(0xFFA500);
                    updateInfo();
                    player1TurnIndicator.fillColor = 0xFFFFFF;
                    player2TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;

                    if (playerCurrency >= player2Bet)
                        this.scene.enableDoubleButton();
                    else
                        this.scene.disableDoubleButton();

                    if (playerCurrency >= player2Bet * .5 && dealerCards[1] === "A")
                        this.scene.enableInsuranceButton();
                    else
                        this.scene.disableInsuranceButton();
                }
                else
                {
                    playerCurrency = playerCurrency + (.5 * player1Bet);
                    didPlayersSurrender[0] = 1;
                    player1CardDisplay.setTint(0xFFA500);
                    updateInfo();
                    // plus more stuff since if its the last player
                    dealerCard.visible = false;
                    shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                    this.scene.revealDealerInfo(dealerCards);
                    // dealer needs to draw to 16, and stand on 17
                    this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                    cardIndex = cardIndex + dealerCards.length - 2;
                    this.scene.isWinOrLoss();
                    this.scene.disableActionButtons();
                    this.scene.disableInsuranceButton();
                    this.scene.disableSplitButton();
                }
            }
            else if (currentPlayer == 1)
            {
                if (numPlayers != 2)
                {
                    playerCurrency = playerCurrency + (.5 * player2Bet);
                    didPlayersSurrender[1] = 1;
                    player2CardDisplay.setTint(0xFFA500);
                    updateInfo();
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player3TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = currentPlayer + 1;

                    if (playerCurrency >= player3Bet)
                        this.scene.enableDoubleButton();
                    else
                        this.scene.disableDoubleButton();

                    if (playerCurrency >= player3Bet * .5 && dealerCards[1] === "A")
                        this.scene.enableInsuranceButton();
                    else
                        this.scene.disableInsuranceButton();
                }
                else
                {
                    playerCurrency = playerCurrency + (.5 * player2Bet);
                    didPlayersSurrender[1] = 1;
                    player2CardDisplay.setTint(0xFFA500);
                    updateInfo();
                    player2TurnIndicator.fillColor = 0xFFFFFF;
                    player1TurnIndicator.fillColor = 0x8E1600;
                    currentPlayer = 0;
                    dealerCard.visible = false;
                    shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                    this.scene.revealDealerInfo(dealerCards);
                    // dealer needs to draw to 16, and stand on 17
                    this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                    cardIndex = cardIndex + dealerCards.length - 2;
                    this.scene.isWinOrLoss();
                    this.scene.disableActionButtons();
                    this.scene.disableInsuranceButton();
                    this.scene.disableSplitButton();
                }
            }
            else if (currentPlayer == 2)
            {
                playerCurrency = playerCurrency + (.5 * player3Bet);
                didPlayersSurrender[2] = 1;
                player3CardDisplay.setTint(0xFFA500);
                updateInfo();
                player3TurnIndicator.fillColor = 0xFFFFFF;
                player1TurnIndicator.fillColor = 0x8E1600;
                currentPlayer = 0;
                dealerCard.visible = false;
                shuffledDeck[cardInts[dealerIndex]].setDepth(1);
                this.scene.revealDealerInfo(dealerCards);
                // dealer needs to draw to 16, and stand on 17
                this.scene.drawDealerCards(dealerCards, cardIndex, cardInts, dealerCards.length);
                cardIndex = cardIndex + dealerCards.length - 2;
                this.scene.isWinOrLoss();
                this.scene.disableActionButtons();
                this.scene.disableInsuranceButton();
                this.scene.disableSplitButton();
            }

        });

        // player chooses insurance
        playerInsurance.on('pointerdown', function(){

            playerInsurance.setTexture('clickedButton');

            this.scene.disableInsuranceButton();

            if (currentPlayer == 0)
            {
                placeholderBet = player1Bet * .5;
                player1InsuranceBet = player1Bet * .5;
                isPlayerInsured[0] = 1;
                playerCurrency = playerCurrency - player1InsuranceBet;
                currencyScoreBoard.setText("Currency: $" + playerCurrency);
                var k = 0;

                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player1InsuranceChips.length; i++)
                    {
                        player1InsuranceChips[i].destroy(true);
                    }

                    numChips = player1InsuranceChips.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - .5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player1ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'half_chip');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - .5;

                        player1InsuranceChips = placeholderChipArray;
                        numChips = player1InsuranceChips.length;
                        k++;
                    }

                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 1)
            {
                placeholderBet = player2Bet * .5;
                player2InsuranceBet = player2Bet * .5;
                isPlayerInsured[1] = 1;
                playerCurrency = playerCurrency - player2InsuranceBet;
                currencyScoreBoard.setText("Currency: $" + playerCurrency);
                var k = 0;

                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player2InsuranceChips.length; i++)
                    {
                        player2InsuranceChips[i].destroy(true);
                    }

                    numChips = player2InsuranceChips.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - .5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player2ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'half_chip');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - .5;

                        player2InsuranceChips = placeholderChipArray;
                        numChips = player2InsuranceChips.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }
            else if (currentPlayer == 2)
            {
                placeholderBet = player3Bet * .5;
                player3InsuranceBet = player3Bet * .5;
                isPlayerInsured[2] = 1;
                playerCurrency = playerCurrency - player3InsuranceBet;
                currencyScoreBoard.setText("Currency: $" + playerCurrency);
                var k = 0;

                while (placeholderBet > 0)
                {
                    for (let i = 0; i < player3InsuranceChips.length; i++)
                    {
                        player3InsuranceChips[i].destroy(true);
                    }

                    numChips = player3InsuranceChips.length;

                    while (placeholderBet - 100 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_100');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 100;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 25 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_25');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 25;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 10 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_10');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 10;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_5');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 5;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - 1 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'chip_1');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - 1;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }

                    while (placeholderBet - .5 >= 0)
                    {
                        placeholderChipArray[k] = this.scene.add.image(player3ChipXCoords - 75, playerChipYCoords - 25 - (k * 5), 'half_chip');
                        placeholderChipArray[k].scale = .075;
                        placeholderChipArray[k].setDepth(100 + k);
                        placeholderBet = placeholderBet - .5;

                        player3InsuranceChips = placeholderChipArray;
                        numChips = player3InsuranceChips.length;
                        k++;
                    }
                }
                placeholderChipArray = [];
            }

        });

        // player chooses splits
        playerSplit.on('pointerdown', function(){

            playerSplit.setTexture('clickedButton');

        });

        nextRoundButton.on('pointerdown', function(){
            nextRoundButton.setTexture('nextRoundButtonClicked');
            this.scene.resetBoard();
            // .75 pen = 3/4 of the decks are dealt
            // 1 * 52 * .75 = 39 cards get played
            // shuffling
            if (cardIndex > Math.floor(numDecks * 52 * deckPen))
            {
                cardIndex = 0;
                // shuffledDeck = this.scene.initializeDeck(numDecks);
                // cardInts = this.scene.shuffleInts(numDecks);
                this.scene.initializeDeck(numDecks);
                this.scene.shuffleInts(numDecks);
                runningCount = 0;
                trueCount = 0;
                runningCountScoreBoard.setText('Running Count: 0');
                trueCountScoreBoard.setText('True Count: 0');

                
                this.scene.anims.create({
                    key: "shuffle",
                    frameRate: 3,
                    frames: this.scene.anims.generateFrameNumbers("shufflingAnim", {start:0, end:2}),
                    repeat: 2,
                    showOnStart: true,
                    hideOnComplete: true
                });
        
                // play a shuffle animation as a test
                shuffleAnimation.play("shuffle");
            }
            
            // this.scene.newRound();
            this.scene.enableBettingButtons();
        });


    };

    update() {
        
    };

}