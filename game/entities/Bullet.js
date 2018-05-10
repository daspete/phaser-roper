import '~/game/PhaserBridge'

class Bullet extends Phaser.Sprite {

    constructor(game, angle, speed, explodeOnContact) {
        super(game, game.player.x, game.player.y, 'hud_gem');
        game.add.existing(this);
        game.physics.p2.enable(this, false);

        this.scale.setTo(0.5, 0.5);

        this.body.clearShapes();
        this.body.addCircle(2, 0, 0);
        this.body.updateCollisionMask();

        this.angle = -(angle + Math.PI * 0.5);
        this.body.fixedRotation = true;
        this.body.mass = 0.001;
        this.body.data.gravityScale = 0;

        this.game = game;

        angle = (angle / 180) * Math.PI;
        this.velocityX = Math.sin(angle) * speed;
        this.velocityY = Math.cos(angle) * speed;

        this.body.velocity.x = this.velocityX;
        this.body.velocity.y = this.velocityY;

        this.explodeOnContact = explodeOnContact;
    }

    update() {
        if (this.x < 5 || this.x > this.game.world.bounds.width - 5 || this.y < 5 || this.y > this.game.world.bounds.height - 5) {
            this.pendingDestroy = true;
        }

        this.TouchingBMP();
    }

    TouchingBMP() {
        if (this.game.terrain.getPixelRGB(Math.round(this.body.x), Math.round(this.body.y + 0)).a > 0.) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.static = true;

            if (this.explodeOnContact) {
                this.pendingDestroy = true;
                //this.explode();
            }
        }
    }



}

export default Bullet;