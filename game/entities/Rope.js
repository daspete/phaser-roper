import '~/game/PhaserBridge'

import Dummy from '~/game/entities/Dummy'

class Rope extends Phaser.Sprite {

    constructor(player, x, y) {
        super(player.game, x, y);
        player.game.add.existing(this);
        
        this.game = player.game;
        this.player = player;

        this.ropeSegments = this.game.add.group();
        this.nSegments = undefined;
        this.anchorPoint = new Phaser.Point();
        this.anchorBody = undefined;
        this.anchorBodyOffset = undefined;
        this.distanceToAnchor = undefined;
        this.constraints = [];
        this.maxRopeLength = this.game.$settings.rope.maxLength;
        this.ropeTimer = 0;
        this.ropeSprites = [];
        this.ropePoints = [];

        for(let i = 0; i < 80; i++){
            this.ropeSprites.push(this.game.add.sprite(0, 0, 'rope'));
            this.ropeSprites[this.ropeSprites.length - 1].alpha = 0;
            this.ropeSprites[this.ropeSprites.length - 1].width = 32;
            this.ropeSprites[this.ropeSprites.length - 1].height = 32;
        }
    }

    IsActive(){
        if (this.ropeSegments.children.length > 0) return true;

        return false;
    }

    CastRope(){
        var y0 = this.player.y;

        this.anchorPoint.x = this.player.x + this.game.$settings.rope.distanceX;
        this.anchorPoint.y = this.player.y;

        var collisions = [];
        var pointAlpha = 0;

        while (this.anchorPoint.y >= 0 && (y0 - this.anchorPoint.y < this.maxRopeLength)) {
            if (this.anchorPoint.x > this.game.world.bounds.width - 3 || this.anchorPoint.x < 3 || this.anchorPoint.y < 3) {
                break;
            }

            collisions = this.game.physics.p2.hitTest(this.anchorPoint);
            //pointAlpha = this.game.terrain.getPixelRGB(Math.round(this.anchorPoint.x), Math.round(this.anchorPoint.y)).a;

            if (collisions.length > 0) {
                if ((collisions[0].parent.sprite == null) || (collisions[0].parent.sprite &&
                    (collisions[0].parent.sprite.key != 'player'))) {
                    this.anchorBody = collisions[0].parent;
                    while (collisions.length > 0) {
                        this.anchorPoint.y += 2;
                        this.anchorPoint.x -= 1;

                        collisions = this.game.physics.p2.hitTest(this.anchorPoint);
                    }
                    break;
                }
            } /*else if (pointAlpha > 0) {
                while (pointAlpha > 0) {
                    this.anchorPoint.y += 2;
                    this.anchorPoint.x -= 1;

                    pointAlpha = this.game.terrain.getPixelRGB(Math.round(this.anchorPoint.x), Math.round(this.anchorPoint.y)).a;
                }

                var anchorSprite = this.game.add.sprite(this.anchorPoint.x, this.anchorPoint.y);
                anchorSprite.key = 'dummy';
                this.game.physics.p2.enable(anchorSprite, this.game.$settings.debug);
                this.anchorBody = anchorSprite.body;
                this.anchorBody.setRectangle(13, 13);
                this.anchorBody.static = true;
                break;
            }*/

            this.anchorPoint.y -= 10;
            this.anchorPoint.x += 6;
        }


        if (this.anchorBody == null) {
            if (y0 - this.anchorPoint.y == this.maxWireLength) {
                this.anchorPoint.x = this.player.x + this.maxWireLength / 2;
                this.anchorPoint.y = this.player.y - this.maxWireLength / 2;
            }
        }

        this.BuildRope();
    }
    
    BuildRope(){
        if (this.ropeSegments.children.length == 0) {
            this.distanceToAnchor = Math.sqrt(Math.pow(
                this.player.x - this.anchorPoint.x, 2) + Math.pow(this.player.y - this.anchorPoint.y, 2
            ));

            this.nSegments = 12;

            for (var i = 1; i <= this.nSegments; i++) {
                var x = (this.player.x + this.game.$settings.rope.distanceX) +
                    i / this.nSegments * (this.anchorPoint.x -
                        (this.player.x + this.game.$settings.rope.distanceX));


                var y = this.player.y + i / this.nSegments * (this.anchorPoint.y - this.player.y);

                if (this.anchorBody == null) {
                    x += this.game.rnd.realInRange(-50, 50);
                }

                var w = this.ropeSegments.create(x, y);
                this.game.physics.p2.enable(w, this.game.$settings.debug);
                w.key = 'ropesegment';
                w.body.setCircle(5);
                w.body.setCollisionGroup(this.game.ropeCG);
                w.body.collides([this.game.spriteCG, this.game.dummyCG]);

                if (this.anchorBody) {
                    w.body.mass = this.game.$settings.rope.mass;
                } else {
                    w.body.mass = 0.2;
                }

                w.body.fixedRotation = true;
                w.body.data.gravityScale = this.game.$settings.rope.bungeeFactor;
            }

            if (this.anchorBody && this.ropeSegments.children[this.nSegments - 1]) {
                this.anchorBodyOffset = [this.anchorBody.x - this.ropeSegments.children[this.nSegments - 1].x,
                this.anchorBody.y - this.ropeSegments.children[this.nSegments - 1].y];
            }

            this.UpdateRope();
        }
    }

    UpdateRope(){
        this.ropeTimer++;

        var y = 1 / 32;
        var wx = [this.player.x];
        var wy = [this.player.y];

        this.ropePoints = [];
        this.ropePoints.push(new Phaser.Point(0,0));

        for (var i = 0; i < (this.nSegments - 1); i++) {
            wx.push(this.ropeSegments.children[i + 1].x);
            wy.push(this.ropeSegments.children[i + 1].y);

            this.ropePoints.push(new Phaser.Point(
                -(this.player.x - this.ropeSegments.children[i + 1].x), 
                -(this.player.y - this.ropeSegments.children[i + 1].y)
            ));
        }

        if(!this.rope){
            this.rope = this.game.add.rope(this.ropePoints[0].x, this.ropePoints[0].y, 'rope', null, this.ropePoints);
            this.player.bringToTop();
        }

        this.rope.alpha = 1;
        this.rope.x = this.player.x;
        this.rope.y = this.player.y;
        this.rope.points = this.ropePoints; 

        var r = 2 * (Math.sin((this.ropeTimer / 18) * 2 * Math.PI) + 1) + 2;

        this.ClearRopeConstraints();

        if (this.distanceToAnchor >= this.game.$settings.rope.maxDistance) {
            this.distanceToAnchor -= this.distanceToAnchor * this.game.$settings.rope.upForce;
        }

        this.constraints.push(this.game.physics.p2.createDistanceConstraint(this.player, this.ropeSegments.children[0], this.distanceToAnchor / (this.nSegments), [this.game.$settings.rope.distanceX, 0]));
        for (var i = 0; i < (this.nSegments - 1); i++) {
            this.constraints.push(this.game.physics.p2.createDistanceConstraint(this.ropeSegments.children[i + 1], this.ropeSegments.children[i], this.distanceToAnchor / (this.nSegments)));
        }
        if (this.anchorBody) {
            this.constraints.push(this.game.physics.p2.createLockConstraint(this.anchorBody, this.ropeSegments.children[this.nSegments - 1], this.anchorBodyOffset));
        }
    }

    DestroyRope(){
        this.ropeTimer = 0;

        this.ClearRopeConstraints();
        this.ropeSegments.destroy(true, true);

        this.anchorBody = undefined;

        if(this.rope){
            this.rope.alpha = 0;
        }
    }


    ClearRopeConstraints(){
        for (var i = 0; i <= this.constraints.length; i++) { 
            try { this.game.physics.p2.removeConstraint(this.constraints[i]); } catch(e){}
        }

        this.constraints = [];
    }

}

export default Rope;  