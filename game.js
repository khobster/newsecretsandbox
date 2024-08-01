const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 2340,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MenuScene, PlayerSelectionScene, MainGameScene]
};

const game = new Phaser.Game(config);
