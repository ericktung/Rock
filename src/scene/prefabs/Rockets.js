class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);
        scene.add.existing(this);
        this.firing = false;
        this.moveSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_rocket');

    }
    update() {
        if (!this.firing) {
            if (keyF.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width -
                borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.firing = true;
        }
        if (this.firing && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.firing = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }


    }

    reset() {
        this.y = game.config.height - borderPadding - borderUISize;
        this.firing = false;
    }
}