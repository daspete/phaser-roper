import '~/game/PhaserBridge'

import Dummy from '~/game/entities/Dummy'
import Rope from './Rope';

class Player extends Phaser.Sprite {

    constructor(game, x, y) {
        super(game, x, y, 'player');
        game.add.existing(this);
        game.physics.p2.enable(this, game.$settings.debug);

        this.game = game;

        this.wireBitmap = this.game.add.bitmapData(this.game.world.bounds.width, this.game.world.bounds.height);
        this.wireBitmap.addToWorld();

        this.frame = 0;

        this.body.clearShapes();
        this.body.addCircle(22, 0, -10);
        this.body.addRectangle(10, 15, 0, 25);
        this.body.updateCollisionMask();

        this.body.fixedRotation = true;
        this.body.mass = game.$settings.player.mass;
        this.body.data.gravityScale = game.$settings.player.gravityScale;

        this.allowAction = true;
        this.playerAlive = true;

        this.rope = new Rope(this, 0, 0);
    }

    update() {
        if (!this.playerAlive) return;

        if (this.IsTouchingLevel()) this.Die();
        if (this.rope.IsActive()) this.rope.UpdateRope();
        if (this.allowAction) this.Act();

        this.game.background.update();
    }

    destroy() {
        this.rope.DestroyRope();

        Phaser.Sprite.prototype.destroy(this);
    }

    Act() {
        if (this.game.input.pointer1.isDown || this.game.spacebar.isDown) {
            if (!this.rope.IsActive()) {
                this.frame = 1;

                this.rope.CastRope();

                if (this.IsTouchingDown()) {
                    this.body.velocity.x = this.game.$settings.player.jumpForce.x;
                    this.body.velocity.y = this.game.$settings.player.jumpForce.y;
                    this.distanceToAnchor -= this.distanceToAnchor * 0.001;
                }
            }
        } else if (this.game.input.pointer1.isUp && this.game.spacebar.isUp) {
            if (this.rope.IsActive()) {
                this.rope.DestroyRope();
            } else {
                if (this.IsTouchingDown()) this.frame = 0;
            }
        }
    }

    IsTouchingLevel() {
        return false;
        var x = Math.round(this.body.x);
        var y = Math.round(this.body.y);


        // if (this.game.terrain.getPixelRGB(x, y).a > 0. ||
        //     this.game.terrain.getPixelRGB(x, y - 20).a > 0. ||
        //     this.game.terrain.getPixelRGB(x + 10, y - 10).a > 0. ||
        //     this.game.terrain.getPixelRGB(x - 10, y - 10).a > 0.) {
        //     return true;
        // } else {
        //     return false;
        // }
    }

    IsTouchingDown() {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
            if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
                var d = p2.vec2.dot(c.normalA, yAxis);
                if (c.bodyA === this.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        } return result;
    }

    Die() {
        this.rope.DestroyRope();

        this.frame = 2;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.static = true;
        this.playerAlive = false;
    }

}

export default Player