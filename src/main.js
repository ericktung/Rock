
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [menu, play],
};

let keyF, keyR, keyLEFT, keyRIGHT;
let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let game = new Phaser.Game(config);
