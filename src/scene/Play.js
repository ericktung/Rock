class Play extends Phaser.Scene {
    constructor() {
        super("play");
    };

    preload() {
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 14 });
    }
    create() {

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)



        this.starfield = this.add.tileSprite
            (0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);


        this.p1Rocket = new Rocket(this, game.config.width / 2, 431, 'rocket').setOrigin(0.5, 0);
        this.p1Rocket.reset();
        this.shipA = new Ship(this, 300, 300, 'ship');
        this.shipB = new Ship(this, 100, 150, 'ship');
        this.shipC = new Ship(this, 200, 200, 'ship');




        this.add.rectangle(0,
            borderUISize + borderPadding,
            game.config.width
            , borderUISize * 2,
            0x00FF00
        ).setOrigin(0, 0);


        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    };
    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        this.starfield.tilePositionX -= 4;
        const movementSpeed = 4;
        if (keyLEFT.isDown) {
            this.p1Rocket.x -= movementSpeed;
        }
        if (keyRIGHT.isDown) {
            this.p1Rocket.x += movementSpeed;
        }
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.p1Rocket.firing = true;
        }

        this.shipA.update();
        this.shipB.update();
        this.shipC.update();

        this.p1Rocket.update();
        if (this.checkCollision(this.p1Rocket, this.shipA)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipA);
        }
        if (this.checkCollision(this.p1Rocket, this.shipB)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipB);

        }
        if (this.checkCollision(this.p1Rocket, this.shipC)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipC);

        }
        if (!this.gameOver) {
            this.p1Rocket.update();         // update rocket sprite
            this.shipA.update();           // update spaceships (x3)
            this.shipB.update();
            this.shipC.update();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menu");
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += 1;
        this.scoreLeft.text = this.p1Score;
        console.log(this.p1Score)
    }

}