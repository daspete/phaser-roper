import '~/game/PhaserBridge'

class Collectible extends Phaser.Sprite {

    constructor(game, collectible) {
        super(game, collectible.position.x, collectible.position.y, collectible.type);
        game.add.existing(this);

        this.collectible = collectible;

        this.noCollision = true;
        this.hasBeenCollected = false;

        this.x += this.width * 0.5;
        this.y -= this.height;

        game.physics.p2.enable(this, game.$settings.debug);
        
        this.game = game;

        //this.body.static = true;
        //this.body.shapes[0].sensor = true;
        this.body.fixedRotation = true;
        this.body.mass = 0.0001;
        this.body.data.gravityScale = 0;

        this.body.setCollisionGroup(game.spriteCG);

        this.body.onBeginContact.add(this.OnContact, this);
        this.body.collides([game.spriteCG]);
    }

    OnContact(body, bodyB, shapeA, shapeB){
        if(this.hasBeenCollected) return;

        if(body && body.sprite && body.sprite.key == 'player'){
            this.hasBeenCollected = true;
            this.body.clearShapes();
            this.alpha = 0;
            this.game.$page.AddScore(this.collectible.points);
        }
    }

}

export default Collectible;