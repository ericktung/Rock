class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.pointvalue = 10;

        this.moveSpeed = game.settings.spaceshipSpeed;

    }

    update() {
        this.x -= 1;
        if (this.x < 0) {
            this.reset();
        }
    }
    reset() {
        this.x = game.config.width;
    }

}