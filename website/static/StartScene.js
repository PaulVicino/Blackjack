class StartScene extends Phaser.Scene {

    constructor() {
        super({ key: 'StartScene' });
    };

    preload() {
        this.load.image('play_button', '/static/assets/playButton.png');
    };

    create() {
        let play = this.add.image(0, 0, 'play_button');
        play.scale = .25;
        play.setPosition(1400/2, 1000/2);

        play.setInteractive({ useHandCursor: true });

        play.on('pointerover', function(pointer) {
            play.scale = .255;
        });

        play.on('pointerout', function(pointer) {
            play.scale = .25;
        });

        play.on('pointerup', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    };

    update() {

    };
}