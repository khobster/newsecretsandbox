class PitcherSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PitcherSelectionScene' });
  }

  preload() {
    this.load.image('field', 'field99.png');
  }

  create(data) {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'field');

    const centerY = this.scale.height / 2;
    const pitchers = [
      { name: 'George', key: 'george' },
      { name: 'Libby', key: 'libby' },
      { name: 'LT', key: 'lt' },
      { name: 'CHRISSY', key: 'christopher' },
      { name: 'MARIA', key: 'maria' },
      { name: 'DAVE', key: 'david' },
      { name: 'MR. SQUISHY', key: 'mrsquishy' },
      { name: 'MIKE', key: 'mike' },
      { name: 'YORICK', key: 'yorick' }
    ];

    const fontStyle = {
      fontSize: '110px',
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
    };

    // Adjusted y-position for title text
    const titleText = this.add.text(this.scale.width / 2, centerY - 350, 'SELECT A PITCHER', {
      fontSize: '110px',
      fontFamily: 'Luckiest Guy',
      fill: '#ffff00',
      stroke: '#000',
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // Adjusted y-position for buttons
    pitchers.forEach((pitcher, index) => {
      const button = this.add.text(this.scale.width / 2, centerY - 250 + (index * 80), pitcher.name, fontStyle)
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.selectPitcher(pitcher.key, data);
        });
    });
  }

  selectPitcher(pitcher, data) {
    console.log('Pitcher selected:', pitcher);
    this.scene.start('MainGameScene', { player: data.player, handedness: data.handedness, pitcher: pitcher });
  }
}

export default PitcherSelectionScene;
