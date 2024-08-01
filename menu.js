class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('field', 'field99.png');
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'field');

    const titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 200, 'SMACK HOMERS!', {
      fontSize: '135px',
      fontFamily: 'Luckiest Guy',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 10,
      shadow: {
        offsetX: 5,
        offsetY: 5,
        color: '#000',
        blur: 10,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    const startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'START', {
      fontSize: '140px',
      fontFamily: 'Luckiest Guy',
      fill: '#ffff00',
      stroke: '#000',
      strokeThickness: 5,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('PlayerSelectionScene');
      });

    this.tweens.add({
      targets: startButton,
      alpha: { from: 1, to: 0 },
      ease: 'Cubic.easeInOut',
      duration: 300,
      repeat: -1,
      yoyo: true
    });
  }
}

export default MenuScene;
