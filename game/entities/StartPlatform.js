import '~/game/PhaserBridge'

class StartPlatform extends Phaser.Sprite {

    constructor(game, element) {
        super(game, element.position.x, element.position.y, element.type);
        this.x += this.width * 0.5;
        this.y -= this.height;

        game.add.existing(this);
        game.physics.p2.enable(this, game.$settings.debug);

        this.game = game;
        

        this.body.clearShapes();
        this.body.loadPolygon('elementphysics', this.key);

        this.body.setCollisionGroup(this.game.spriteCG);
        this.body.collides([this.game.spriteCG, this.game.ropeCG ]);

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

export default StartPlatform;  