import '~/game/PhaserBridge'

class Cloud extends Phaser.Sprite {

    constructor(game, x, y) {
        super(game, x, y, 'cloud');
        game.add.existing(this);
        game.physics.p2.enable(this, game.$settings.debug);

        this.body.clearShapes();
        this.body.addRectangle(230, 25, -4, 0);
        this.body.updateCollisionMask();

        this.body.fixedRotation = true;
        this.body.mass = 1000;
        this.body.data.gravityScale = 0;

        this.alpha = 0.7;
        this.timer = 0;

    }

    update() {
        this.body.velocity.y = -20 * Math.sin((3 * this.timer / 360) * 2 * Math.PI);
        this.timer++;
        if (this.timer == 360) { this.timer = 0; }
    }

}

export default Cloud;  