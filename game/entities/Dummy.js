import '~/game/PhaserBridge'

class Dummy extends Phaser.Sprite {

    constructor(game, x, y) {
        super(game, x, y);
        game.add.existing(this);
        game.physics.p2.enable(this, game.$settings.debug);

        this.key = 'dummy';
        this.body.setRectangle(20, 20);
        this.body.static = true;
        this.body.setCollisionGroup(game.dummyCG);
        this.body.collides(game.wireCG);

        this.contacted = false;
        this.counter = 0;

    }

    update() {
        if (!this.contacted) { this.counter++; }
        if (this.counter > 20) { this.pendingDestroy = true; }
    }

}

export default Dummy;