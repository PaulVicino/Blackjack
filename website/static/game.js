// set configuration of the game
const config = {
    type: Phaser.AUTO, // uses WebGL if available, otherwise uses canvas
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1400,
        height: 1000,
        backgroundColor: "000000",
    },
    scene: [StartScene, GameScene],
};

// create a new game, and pass the configuration
const game = new Phaser.Game(config);