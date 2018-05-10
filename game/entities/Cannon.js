import '~/game/PhaserBridge'

import Bullet from '~/game/entities/Bullet'

class Canon extends Phaser.Sprite {

    constructor(player) {
        this.player = player;
        this.game = player.game;

        this.orientation = player.orientation;
        this.delta = this.game.rnd.realInRange(-10, 10);
        this.phi = 20;
        this.timer = 0;

        this.wireDestroyed = false;

        super(this.game, this.player.x, this.player.y);
        this.game.add.existing(this);
    }

    update() {
        if (this.phi <= 160) {
            if (this.orientation == 'right') {
                this.bullets.push(new Bullet(this.game, -this.phi + this.delta, 700, false));
            } else {
                this.bullets.push(new Bullet(this.game, this.phi + this.delta, 700, false));
            }
        }

        if (!this.player.IsWireActive()) { this.wireDestroyed = true; }

        if (this.wireDestroyed && this.timer > 40) {
            // this.game.terrain.blendDestinationOut();

            // for (var i = 0; i < this.bullets.length; i++) {
            //     this.bullets[i].explode();
            // }
            // this.bullets = [];

            // this.game.terrain.blendReset();
            // this.game.terrain.update();

            this.pendingDestroy = true;
        }

        this.phi += 20;
        this.timer += 1;
    }



}