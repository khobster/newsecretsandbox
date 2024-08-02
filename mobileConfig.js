import MenuScene from './menuScene.js';
import PitcherSelectionScene from './pitcherSelection.js';
import MainGameScene from './mainGame.js';

export default {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [MenuScene, PitcherSelectionScene, MainGameScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};
