class PlayerSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerSelectionScene' });
  }

  preload() {
    this.load.image('field', 'field99.png');
  }

  create(data) {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'field');

    const centerY = this.scale.height / 2;

    const titleText = this.add.text(this.scale.width / 2, centerY - 100, 'WHO ARE YOU?', {
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

    const rightButton = this.add.text(this.scale.width / 2, centerY + 50, 'Right-Handed', {
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
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.showNameInput('R');
    });

    const leftButton = this.add.text(this.scale.width / 2, centerY + 150, 'Left-Handed', {
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
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.showNameInput('L');
    });
  }

  showNameInput(handedness) {
    console.log('Handedness selected:', handedness);

    this.children.list.forEach(child => {
      if (child.text === 'Right-Handed' || child.text === 'Left-Handed') {
        child.setVisible(false);
      }
    });

    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'absolute';
    inputContainer.style.top = '50%';
    inputContainer.style.left = '50%';
    inputContainer.style.transform = 'translate(-50%, -50%)';
    inputContainer.style.textAlign = 'center';
    inputContainer.style.zIndex = '10';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'nameInput';
    nameInput.placeholder = 'Enter your name';
    nameInput.style.width = '300px';
    nameInput.style.height = '40px';
    nameInput.style.fontSize = '24px';
    nameInput.style.textAlign = 'center';
    inputContainer.appendChild(nameInput);

    const submitButton = document.createElement('button');
    submitButton.innerText = 'OK';
    submitButton.style.fontSize = '24px';
    submitButton.style.padding = '10px';
    submitButton.style.marginTop = '10px';
    inputContainer.appendChild(submitButton);

    this.sys.game.canvas.parentNode.appendChild(inputContainer);

    submitButton.onclick = () => {
      const playerName = nameInput.value;
      console.log('Player name entered:', playerName);
      this.selectPlayer(playerName, handedness);
      inputContainer.remove();
    };

    nameInput.focus();
  }

  selectPlayer(playerName, handedness) {
    console.log(`Selecting player: ${playerName}, Handedness: ${handedness}`);
    this.time.delayedCall(500, () => {
      this.scene.start('PitcherSelectionScene', { player: playerName, handedness: handedness });
    });
  }
}

export default PlayerSelectionScene;
