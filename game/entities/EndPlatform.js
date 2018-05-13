import '~/game/PhaserBridge'

class EndPlatform extends Phaser.Sprite {

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

        this.body.onBeginContact.add(this.OnContact, this);

    }

    update() {
        this.body.velocity.y = -20 * Math.sin((3 * this.timer / 360) * 2 * Math.PI);
        this.timer++;
        if (this.timer == 360) { this.timer = 0; }
    }

    OnContact(body, bodyB, shapeA, shapeB){
        if (body && body.sprite && body.sprite.key == 'player' && this.game.player.IsTouchingDown() &&
            Math.abs(this.game.player.x - this.x) < 120) {
            this.game.playerWins = true;
        }
    }

}

export default EndPlatform;  