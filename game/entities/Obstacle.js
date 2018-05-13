import '~/game/PhaserBridge'

class Obstacle extends Phaser.Sprite {

    constructor(game, obstacle) {
        super(game, obstacle.position.x, obstacle.position.y, obstacle.type);
        game.add.existing(this);

        this.x += this.width * 0.5;
        this.y -= this.height;

        game.physics.p2.enable(this, game.$settings.debug);
        this.body.clearShapes();
        this.body.loadPolygon('elementphysics', this.key);


        this.game = game;

        this.body.static = true;

        this.body.setCollisionGroup(game.spriteCG);
        this.body.collides([game.ropeCG, game.spriteCG]);
    }


}

export default Obstacle;