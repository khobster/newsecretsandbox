class PitcherSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PitcherSelectionScene' });
  }

  preload() {
    this.load.image('field', 'field99.png');
  }

  create(data) {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'field');

    const pitchers = ['george', 'libby', 'lt', 'christopher', 'maria', 'david', 'mrsquishy', 'mike', 'yorick'];
    const pitcherButtons = [];

    pitchers.forEach((pitcher, index) => {
      const button = this.add.text(this.scale.width / 2, 150 + index * 50, pitcher, {
        fontSize: '45px',
        fontFamily: 'Luckiest Guy',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: '#000',
          blur: 5,
          stroke: true,
          fill: true
        }
      }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
        this.selectPitcher(pitcher, data);
      });
      pitcherButtons.push(button);
    });
  }

  selectPitcher(pitcher, data) {
    console.log('Pitcher selected:', pitcher);
    this.scene.start('MainGameScene', { ...data, pitcher });
  }
}

export default PitcherSelectionScene;
