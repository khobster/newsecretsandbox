import MenuScene from './menu.js';
import PlayerSelectionScene from './playerSelection.js';
import PitcherSelectionScene from './pitcherSelection.js';
import MainGameScene from './mainGame.js';

const mobileConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1080,  // Original width
    height: 2340,
    scale: {
        mode: Phaser.Scale.ENVELOP, // Changed to ENVELOP mode
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MenuScene, PlayerSelectionScene, PitcherSelectionScene, MainGameScene]
};

export default mobileConfig;
