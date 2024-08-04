class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
    this.gameState = 'waitingForPitch';
    this.pitchInProgress = false;
    this.hitRegistered = false;
    this.homeRuns = 0;
    this.outs = 0;
    this.maxOuts = 5;
    this.maxSwingAngle = 45;
    this.minSwingAngle = -45;
    this.shouldZoom = false; // Add this flag
  }

  init(data) {
    this.selectedPlayer = data.player;
    this.handedness = data.handedness;
    this.selectedPitcher = data.pitcher;
    this.shouldZoom = data.shouldZoom || false; // Initialize it based on data
    console.log('Scene initialized with player:', this.selectedPlayer, 'Handedness:', this.handedness, 'Pitcher:', this.selectedPitcher, 'Should Zoom:', this.shouldZoom);
  }

  preload() {
    this.load.image('field', 'field99.png');
    this.load.spritesheet('batter', 'batter55.png', { frameWidth: 64, frameHeight: 68 });
    this.load.spritesheet('batter_l', 'batter_l88.png', { frameWidth: 64, frameHeight: 68 });
    this.load.spritesheet('george', 'georgepitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('libby', 'libbypitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('lt', 'ltpitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('christopher', 'christopherpitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('maria', 'mariapitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('david', 'davidpitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('mrsquishy', 'mrsquishypitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('mike', 'mikepitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.spritesheet('yorick', 'yorickpitcher.png', { frameWidth: 445, frameHeight: 396 });
    this.load.image('ball', 'ball.png');
  }

  async create() {
    const offsetX = this.scale.width / 2 - 400; // Adjust offset for centering
    const offsetY = this.scale.height / 2 - 262; // Adjust offset for centering

    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.add.image(this.scale.width / 2, this.scale.height / 2, 'field');

    this.anims.create({
      key: 'batter_swing',
      frames: this.anims.generateFrameNumbers('batter', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'batter_swing_l',
      frames: this.anims.generateFrameNumbers('batter_l', { start: 0, end: 5 }),
      frameRate: 9,
      repeat: 0
    });

    this.anims.create({
      key: 'pitcher_throw',
      frames: this.anims.generateFrameNumbers(this.selectedPitcher, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: 0
    });

    const scaleWidth = (384 / 2667) * 2.5;
    const scaleHeight = (57 / 396) * 2.5;

    const pitcher = this.add.sprite(this.scale.width / 2, offsetY + 350, this.selectedPitcher).setScale(scaleWidth, scaleHeight).setOrigin(0.5, 1);
    const ball = this.physics.add.sprite(this.scale.width / 2 - 10, offsetY + 295, 'ball').setScale(2.1).setOrigin(0.5, 0.5).setVisible(false);
    ball.body.allowGravity = false;

    const ballShadow = this.add.graphics();
    ballShadow.fillStyle(0x000000, 0.5);
    ballShadow.fillEllipse(0, 0, 20, 10);
    ballShadow.setVisible(false);

    const redLine = this.add.rectangle(this.scale.width / 2, offsetY + 90, 800, 10, 0xff0000).setOrigin(0.5, 0.5).setAlpha(0);
    this.physics.add.existing(redLine);
    redLine.body.allowGravity = false;
    redLine.body.immovable = true;

    this.physics.world.setBoundsCollision(true, true, true, true);

    const startButton = this.add.text(this.scale.width / 2, offsetY + 300, 'Start Game', {
      fontSize: '140px',
      fontFamily: 'Luckiest Guy',
      fill: '#fff'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.startGame(), this)
      .setShadow(5, 5, '#000', 10, true, true);

    this.tweens.add({
      targets: startButton,
      alpha: { from: 1, to: 0 },
      ease: 'Cubic.easeInOut',
      duration: 300,
      repeat: -1,
      yoyo: true
    });

    const restartButton = this.add.text(this.scale.width / 2, offsetY + 300, 'Restart Game', {
      fontSize: '55px',
      fontFamily: 'Luckiest Guy',
      fill: '#fff'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.resetGame())
      .setShadow(5, 5, '#000', 10, true, true);
    restartButton.setVisible(false);

    const switchPlayerButton = this.add.text(this.scale.width / 2, offsetY + 350, 'Switch Player', {
      fontSize: '50px',
      fontFamily: 'Luckiest Guy',
      fill: '#ffff00'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('PlayerSelectionScene'))
      .setShadow(5, 5, '#000', 10, true, true);

    // Disable the button by setting it to not interactive and making it fully transparent
    switchPlayerButton.disableInteractive();
    switchPlayerButton.setAlpha(0); // Make it fully transparent

    this.tweens.add({
      targets: restartButton,
      alpha: { from: 1, to: 0 },
      ease: 'Cubic.easeInOut',
      duration: 300,
      repeat: -1,
      yoyo: true
    });

    const playerNameText = this.add.text(this.scale.width / 2, offsetY + 594, `${this.selectedPlayer}`, {
      fontSize: '45px',
      fontFamily: 'Luckiest Guy',
      fill: '#FFFFFF',
      stroke: '#000',
      strokeThickness: 1,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    const scoreText = this.add.text(this.scale.width / 2, offsetY + 660, 'Home Runs     0\nOuts     0', {
      fontSize: '40px',
      fontFamily: 'Luckiest Guy',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 1,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    const homeRunText = this.add.text(this.scale.width / 2, offsetY + 200, 'HOME RUN!', {
      fontSize: '125px',
      fontFamily: 'Luckiest Guy',
      align: 'center',
      stroke: '#000',
      strokeThickness: 8,
      shadow: {
        offsetX: 5,
        offsetY: 5,
        color: '#000',
        blur: 10,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    const gradient = homeRunText.context.createLinearGradient(0, 0, homeRunText.width, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.17, '#ff9900');
    gradient.addColorStop(0.34, '#ffff00');
    gradient.addColorStop(0.51, '#00ff00');
    gradient.addColorStop(0.68, '#00ffff');
    gradient.addColorStop(0.85, '#0000ff');
    gradient.addColorStop(1, '#ff00ff');
    homeRunText.setFill(gradient);
    homeRunText.setVisible(false);

    const outText = this.add.text(this.scale.width / 2, offsetY + 200, 'Out', {
      fontSize: '64px',
      fontFamily: 'Luckiest Guy',
      align: 'center',
      fill: '#fff',
      shadow: {
        offsetX: 5,
        offsetY: 5,
        color: '#000',
        blur: 10,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setVisible(false);

    const rankText = this.add.text(this.scale.width / 2, offsetY + 550, 'Loading rank...', {
      fontSize: '40px',
      fontFamily: 'Luckiest Guy',
      fill: '#ffff00',
      stroke: '#000',
      strokeThickness: 1,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setVisible(false);

    this.startButton = startButton;
    this.restartButton = restartButton;
    this.switchPlayerButton = switchPlayerButton; // Ensure it's assigned to the class
    this.pitcher = pitcher;
    this.ball = ball;
    this.ballShadow = ballShadow;
    this.playerNameText = playerNameText;
    this.scoreText = scoreText;
    this.homeRunText = homeRunText;
    this.outText = outText;
    this.rankText = rankText;

    this.createBatter();

    this.input.on('pointerdown', () => {
      if (this.gameState === 'pitching') {
        this.swingBat();
      }
    });

    this.batter.on('animationupdate', (anim, frame) => {
      console.log('Animation frame index:', frame.index);
    });

    this.cameras.main.setZoom(this.shouldZoom ? 1 : 1); // Start with no zoom or initial zoom if required
    this.cameras.main.centerOn(this.scale.width / 2, this.scale.height / 2); // Center the camera

    this.pitchTimerEvent = this.time.addEvent({
      delay: 3000,
      callback: this.startPitch,
      callbackScope: this,
      loop: true,
      paused: true
    });
  }

  createBatter() {
    const batterKey = this.handedness === 'L' ? 'batter_l' : 'batter';
    const batterSwingKey = this.handedness === 'L' ? 'batter_swing_l' : 'batter_swing';
    let batterX = this.scale.width / 2 + (this.handedness === 'L' ? 25 : -35); // Adjust for centering

    console.log('Using batter sprite:', batterKey, 'at position:', batterX);

    this.batter = this.add.sprite(batterX, this.offsetY + 500, batterKey).setScale(2.1).setOrigin(0.5, 1);

    console.log('Batter sprite properties:', this.batter);

    const hittingAreaX = batterX;
    const hittingArea = this.add.rectangle(hittingAreaX, this.batter.y - 40, 60, 20, 0xff00ff, 0).setOrigin(0.5, 0.5);
    this.physics.add.existing(hittingArea);
    hittingArea.body.immovable = true;
    hittingArea.body.allowGravity = false;
    hittingArea.visible = false;

    this.hittingArea = hittingArea;
    this.batterSwingKey = batterSwingKey;
  }

  update() {
    const { ball, batter, hittingArea } = this;

    if (this.pitchInProgress && (ball.y > this.offsetY + 524 || ball.x < this.offsetX || ball.x > this.offsetX + 800) && !this.hitRegistered) {
      console.log('Ball out of bounds');
      this.resetPitch();
    }

    if (batter.anims.isPlaying) {
      console.log('Animation progress:', batter.anims.getProgress());
    }

    if (batter.anims.isPlaying && batter.anims.getProgress() >= 1) {
      batter.setFrame(5);
      if (!this.hitRegistered) {
        console.log('Swing missed');
        this.gameState = 'waitingForPitch';
        this.resetPitch();
      }
    }

    if (this.gameState === 'swinging') {
      const progress = batter.anims.getProgress();
      const swingAngle = Phaser.Math.Linear(this.minSwingAngle, this.maxSwingAngle, progress);
      hittingArea.setAngle(swingAngle);
      console.log('Swing angle:', swingAngle);
      this.checkHit();
    }
  }

  startGame() {
    console.log('Game started');
    this.startButton.setVisible(false);
    this.restartButton.setVisible(false);
    this.switchPlayerButton.setAlpha(0); // Keep it fully transparent
    this.homeRuns = 0;
    this.outs = 0;
    this.updateScore();
    this.gameState = 'waitingForPitch';
    this.pitchTimerEvent.paused = false;

    // Sudden zoom in when the game starts
    if (this.shouldZoom) {
      this.cameras.main.setZoom(2.5);
      this.cameras.main.centerOn(this.scale.width / 2, this.offsetY + 350);
    }
  }

  startPitch() {
    if (this.gameState !== 'waitingForPitch' || this.outs >= this.maxOuts) return;

    console.log('Pitch started');
    this.gameState = 'pitching';
    this.pitchInProgress = true;
    this.hitRegistered = false;
    this.pitcher.setFrame(0);
    this.pitcher.anims.play('pitcher_throw');

    if (this.shouldZoom) {
      this.cameras.main.setZoom(2.5); // Ensure zoom is maintained
      this.cameras.main.centerOn(this.scale.width / 2, this.offsetY + 350); // Ensure camera position is maintained
    }

    this.pitcher.once('animationcomplete', () => {
      this.ball.setVisible(true);
      this.pitchBall();
      this.time.delayedCall(1000, () => {
        if (this.gameState === 'pitching' && !this.hitRegistered) {
          console.log('Pitch missed');
          this.resetPitch();
        }
      });
    });
  }

  pitchBall() {
    const { ball, ballShadow, pitcher } = this;

    console.log('Ball pitched');
    ball.setActive(true).setVisible(true);
    ball.setPosition(pitcher.x, pitcher.y - 20);
    ball.setVelocity(0);

    const pitchSpeed = 600;
    const pitchAngle = Phaser.Math.Between(0, 0);
    const xVelocityAdjustment = -72;
    ball.setVelocityY(pitchSpeed);
    ball.setVelocityX(pitchSpeed * Math.tan(Phaser.Math.DegToRad(pitchAngle)) + xVelocityAdjustment);

    this.pitchInProgress = true;

    ballShadow.setVisible(true);
    ballShadow.x = ball.x;
    ballShadow.y = ball.y + 10;
  }

  swingBat() {
    console.log('Bat swung with key:', this.batterSwingKey);
    this.batter.anims.play(this.batterSwingKey);
    this.gameState = 'swinging';
    this.hittingArea.visible = true;

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  checkHit() {
    console.log('Checking for hit...');
    if (this.gameState === 'swinging' && this.physics.overlap(this.hittingArea, this.ball) && !this.hitRegistered) {
      console.log('Hit detected');
      this.hitRegistered = true;
      this.hittingArea.visible = false;

      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

      this.hitBall(this.ball, this.hittingArea);
    }
  }

  hitBall(ball, hittingArea) {
    const { ballShadow } = this;

    this.hitRegistered = true;
    ball.body.allowGravity = false;

    const isHomeRun = this.coinFlipForHomeRun();
    const targetXAdjustment = -25;
    const targetX = Phaser.Math.Between(this.offsetX, this.offsetX + 800) + targetXAdjustment;
    let targetY = Phaser.Math.Between(this.offsetY + 219, this.offsetY + 320);
    if (isHomeRun) {
      targetY = this.offsetY + 96;
    }

    ballShadow.setVisible(true);
    ballShadow.x = ball.x;
    ballShadow.y = ball.y;

    const controlX = (ball.x + targetX) / 2;
    const controlY = this.offsetY - 600;

    const bezierX = [ball.x, controlX, targetX];
    const bezierY = [ball.y, controlY, targetY];

    this.tweens.add({
      targets: ball,
      x: { value: targetX, duration: 3500, ease: 'Sine.easeInOut' },
      y: { value: targetY, duration: 3500, ease: 'Sine.easeInOut' },
      onUpdate: (tween, target) => {
        const t = tween.progress;
        const bezierXValue = Phaser.Math.Interpolation.Bezier(bezierX, t);
        const bezierYValue = Phaser.Math.Interpolation.Bezier(bezierY, t);

        target.x = bezierXValue;
        target.y = bezierYValue;

        ballShadow.x = bezierXValue;
        ballShadow.y = isHomeRun ? Math.min(bezierYValue + 10, this.offsetY + 219) : bezierYValue + 10;
      },
      onComplete: () => {
        if (isHomeRun) {
          ballShadow.setVisible(false);
          this.homeRun();
        } else {
          this.ballOut();
        }
        this.resetPitch();
      }
    });

    this.tweens.add({
      targets: ballShadow,
      x: { value: targetX, duration: 3500, ease: 'Sine.easeInOut' },
      y: { value: isHomeRun ? this.offsetY + 219 : targetY + 10, duration: 3500, ease: 'Sine.easeInOut' }
    });

    if (this.shouldZoom) {
      // Pan out and zoom out when the ball is hit to show more of the field
      this.cameras.main.setZoom(1.5); // Zoom out a bit more
      this.cameras.main.centerOn(this.scale.width / 2, this.scale.height / 2); // Center the camera
    }
  }

  async homeRun() {
    console.log('Home run scored');
    this.homeRuns++;
    this.updateScore();
    this.homeRunText.setVisible(true);

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    this.cameras.main.shake(500);

    this.time.delayedCall(1000, () => {
      this.homeRunText.setVisible(false);
      this.batter.setFrame(0);
      if (this.shouldZoom) {
        this.cameras.main.setZoom(2.5);
        this.cameras.main.centerOn(this.scale.width / 2, this.offsetY + 350);
      }
      this.resetPitch();
    });
  }

  ballOut() {
    if (!this.pitchInProgress) return;
    console.log('Out recorded');
    this.pitchInProgress = false;

    this.outs++;
    this.updateScore();
    this.outText.setVisible(true);
    this.time.delayedCall(1000, () => {
      this.outText.setVisible(false);
      this.batter.setFrame(0);
      if (this.shouldZoom) {
        this.cameras.main.setZoom(2.5);
        this.cameras.main.centerOn(this.scale.width / 2, this.offsetY + 350);
      }
      this.resetPitch();
    });
  }

  updateScore() {
    this.scoreText.setText(`Home Runs ${this.homeRuns}\nOuts ${this.outs}`);
  }

  resetPitch() {
    const { ball, ballShadow, pitcher } = this;

    console.log('Resetting pitch');
    ball.setVisible(false);
    ball.setPosition(pitcher.x - 15, pitcher.y - 60);
    ball.setVelocity(0);
    ball.body.allowGravity = false;
    this.pitchInProgress = false;
    this.hitRegistered = false;
    this.gameState = 'waitingForPitch';
    this.hittingArea.visible = false;
    if (pitcher.anims.isPlaying) {
      pitcher.anims.stop();
    }
    pitcher.setFrame(0);

    ballShadow.setVisible(false);

    if (this.outs < this.maxOuts) {
      this.time.delayedCall(5000, () => {
        this.pitchTimerEvent.paused = false;
      });
    } else {
      this.endGame();
    }
  }

  async resetGame() {
    console.log('Resetting game');
    this.startButton.setVisible(true);
    this.restartButton.setVisible(false);
    this.rankText.setVisible(false); // Hide the rank text when resetting the game
    this.switchPlayerButton.setAlpha(0); // Keep it fully transparent
    this.gameState = 'waitingForPitch';
    this.outs = 0;
    this.homeRuns = 0;
    this.updateScore();
    this.batter.setFrame(0);
    this.cameras.main.setZoom(this.shouldZoom ? 1 : 1); // Ensure no zoom if shouldZoom is false
    this.cameras.main.centerOn(this.scale.width / 2, this.scale.height / 2);

    this.pitchTimerEvent.remove();
    this.pitchTimerEvent = this.time.addEvent({
      delay: 5000,
      callback: this.startPitch,
      callbackScope: this,
      loop: true,
      paused: true
    });
  }

  async endGame() {
    console.log('Game ended');
    this.time.removeAllEvents();
    this.restartButton.setVisible(true);
    this.switchPlayerButton.setAlpha(0); // Keep it fully transparent

    this.startButton.setVisible(false);

    // Display loading message
    this.rankText.setText('Loading rank...').setVisible(true);

    // Submit the current score
    const submitResult = await this.submitScore(this.selectedPlayer, this.homeRuns);
    console.log('Score submission result:', submitResult);

    // Get the top scores and determine the rank
    const topScores = await this.getTopScores();
    console.log('Top scores:', topScores);
    const rank = topScores.findIndex(score => score.score <= this.homeRuns) + 1;

    console.log('Calculated rank:', rank);

    // Update the rankText with the rank
    this.rankText.setText(`TODAY'S RANK: ${rank}`);

    // Optionally, shake or flash the rankText to draw attention
    this.tweens.add({
      targets: this.rankText,
      alpha: { from: 0, to: 1 },
      ease: 'Cubic.easeInOut',
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  coinFlipForHomeRun() {
    return Math.random() < 0.5;
  }

  async submitScore(player, score) {
    try {
      const response = await fetch('https://us-central1-smack-homers.cloudfunctions.net/submitScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player, score })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit score: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting score:', error);
      return { message: 'Error submitting score' };
    }
  }

  async getTopScores() {
    try {
      const response = await fetch('https://us-central1-smack-homers.cloudfunctions.net/getTopScores');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get top scores: ${response.status} ${errorText}`);
      }

      const scores = await response.json();
      return scores;
    } catch (error) {
      console.error('Error getting top scores:', error);
      return [];
    }
  }
}

export default MainGameScene;
