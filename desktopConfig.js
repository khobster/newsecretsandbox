import MenuScene from './menu.js';
import PlayerSelectionScene from './playerSelection.js';
import PitcherSelectionScene from './pitcherSelection.js';
import MainGameScene from './mainGame.js';

const desktopConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1920,  // Desktop width
    height: 1080, // Desktop height
    scale: {
        mode: Phaser.Scale.ENVELOP, // Similar to mobile config
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

export default desktopConfig;
