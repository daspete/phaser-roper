import '~/game/PhaserBridge'

import Bullet from '~/game/entities/Bullet'
import Dummy from '~/game/entities/Dummy'

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
        this.showPointer = true;
        this.playerAlive = true;
        this.orientation = 'right';

        this.wireSegments = this.game.add.group();
        this.nSegments = undefined;
        this.anchorPoint = new Phaser.Point();
        this.anchorBody = undefined;
        this.anchorBodyOffset = undefined;
        this.distanceToAnchor = undefined;
        this.constraints = [];
        this.maxWireLength = game.$settings.wire.maxLength;
        this.wireTimer = 0;

        this.shootTimer = game.$settings.player.shootTimer;
        this.touchReloaded = true;
        this.bullets = [];

        // this.button = game.add.bitmapData(200, 200);
        // this.button.circle(100, 100, 100, 'rgb(207,140,155)');
        // this.button.circle(100, 100, 90, 'rgb(207,113,134)');
        // this.button.circle(100, 100, 80, 'rgb(207,69,100)');
        // this.buttonSprite = game.add.sprite(-100, -100, this.button);
        // this.buttonSprite.anchor.setTo(0.5, 0.5);
        // this.buttonSprite.alpha = 0.8;
        this.isButtonActive = false;

        this.indicator = game.add.sprite(this.x, this.y, 'indicator');
        this.indicator.anchor.setTo(0, 0.5);
        this.indicator.alpha = 0.;
    }

    update() {
        if (!this.playerAlive) {
            this.wireBitmap.clear();
            return;
        }

        if (this.IsWireActive()) {
            this.UpdateWire();

            // if (this.isButtonActive) {
            //     this.buttonSprite.fixedToCamera = false;
            //     this.buttonSprite.x = -100;
            //     this.buttonSprite.y = -100;
            //     this.buttonSprite.fixedToCamera = true;
            //     this.isButtonActive = false;
            // }

            if (this.game.input.mousePointer.isDown && this.shootTimer > 60) {
                // let angle = 180 * Math.atan2(
                //     this.game.input.mousePointer.worldX - this.x,
                //     this.game.input.mousePointer.worldY - this.y
                // ) / Math.PI;

                // this.ShootBullet(angle);
                this.shootTimer = 0;
            }
        } else if (this.showPointer) {
            //this.UpdatePointer();
        }

        if (this.allowAction) {
            this.Act();
        }

        if (this.IsTouchingLevel()) {
            this.Die();
        }

        this.shootTimer++;

    }

    destroy() {
        this.ClearWireConstraints();
        this.DestroyWire();

        this.wireSegments.destroy(true, false);
        this.wireBitmap.destroy();

        Phaser.Sprite.prototype.destroy(this);
    }

    Act() {
        if (this.game.input.pointer1.isDown || this.game.spacebar.isDown) {
            if (!this.IsWireActive()) {
                this.CastWire();
                this.frame = 1;

                // prevent switching direction when shooting wire from ground
                if (this.IsTouchingDown()) {
                    this.body.velocity.x = this.game.$settings.player.jumpForce.x;
                    this.body.velocity.y = this.game.$settings.player.jumpForce.y;
                    this.distanceToAnchor -= this.distanceToAnchor * 0.001;
                }
            }
        } else if (this.game.input.pointer1.isUp && this.game.spacebar.isUp) {
            if (this.IsWireActive()) {
                this.DestroyWire();
            } else {
                if (this.IsTouchingDown()) { this.frame = 0; }
            }
        }
    }

    UpdatePointer() {
        this.wireBitmap.clear();

        for (var i = 0; i <= 50; i++) {
            this.wireBitmap.rect(this.x + i + 4, this.y - (2 * i) - 10, 2, 2, 'rgba(255, 0, 0, ' + (1 - i / 50. - Math.exp(-i / 10)).toString() + ')');
        }
    }

    IsTouchingLevel() {
        var x = Math.round(this.body.x);
        var y = Math.round(this.body.y);
        if (this.game.terrain.getPixelRGB(x, y).a > 0. ||
            this.game.terrain.getPixelRGB(x, y - 20).a > 0. ||
            this.game.terrain.getPixelRGB(x + 10, y - 10).a > 0. ||
            this.game.terrain.getPixelRGB(x - 10, y - 10).a > 0.) {
            return true;
        } else {
            return false;
        }
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
        this.DestroyWire();
        this.frame = 2;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.static = true;
        this.playerAlive = false;
    }



    IsWireActive() {
        if (this.wireSegments.children.length > 0) return true;

        return false;

    }

    ShootBullet(angle) {
        new Bullet(this.game, angle, 700, true);
        new Bullet(this.game, angle + this.game.rnd.realInRange(-5, 5), 700, true);
        new Bullet(this.game, angle + this.game.rnd.realInRange(-5, 5), 700, true);
    }

    CastWire() {
        var y0 = this.y;

        this.anchorPoint.x = this.x + this.game.$settings.wire.distanceX;
        this.anchorPoint.y = this.y;

        var body_array = [];
        var bmp_alpha = 0;

        while (this.anchorPoint.y >= 0 && (y0 - this.anchorPoint.y < this.maxWireLength)) {
            if (this.anchorPoint.x > this.game.world.bounds.width - 3 || this.anchorPoint.x < 3 || this.anchorPoint.y < 3) {
                break;
            }

            body_array = this.game.physics.p2.hitTest(this.anchorPoint);
            bmp_alpha = this.game.terrain.getPixelRGB(Math.round(this.anchorPoint.x), Math.round(this.anchorPoint.y)).a;

            if (body_array.length > 0) {
                if ((body_array[0].parent.sprite == null) || (body_array[0].parent.sprite &&
                    (body_array[0].parent.sprite.key != 'player'))) {
                    this.anchorBody = body_array[0].parent;
                    while (body_array.length > 0) {
                        this.anchorPoint.y += 2;
                        this.anchorPoint.x -= 1;

                        body_array = this.game.physics.p2.hitTest(this.anchorPoint);
                    }
                    break;
                }
            } else if (bmp_alpha > 0) {
                while (bmp_alpha > 0) {
                    this.anchorPoint.y += 2;
                    this.anchorPoint.x -= 1;

                    bmp_alpha = this.game.terrain.getPixelRGB(Math.round(this.anchorPoint.x), Math.round(this.anchorPoint.y)).a;
                }

                var anchorSprite = this.game.add.sprite(this.anchorPoint.x, this.anchorPoint.y);
                anchorSprite.key = 'dummy';
                this.game.physics.p2.enable(anchorSprite, this.game.$settings.debug);
                this.anchorBody = anchorSprite.body;
                this.anchorBody.setRectangle(13, 13);
                this.anchorBody.static = true;
                break;
            }

            this.anchorPoint.y -= 10;
            this.anchorPoint.x += 6;
        }


        if (this.anchorBody == null) {
            if (y0 - this.anchorPoint.y == this.maxWireLength) {
                this.anchorPoint.x = this.x + this.maxWireLength / 2;
                this.anchorPoint.y = this.y - this.maxWireLength / 2;
            }
        }

        this.BuildWire();
    }

    BuildWire() {
        if (this.wireSegments.children.length == 0) {
            this.distanceToAnchor = Math.sqrt(Math.pow(this.x - this.anchorPoint.x, 2) + Math.pow(this.y - this.anchorPoint.y, 2));
            this.nSegments = this.game.$settings.wire.segments;//~~(this.distanceToAnchor / this.game.$settings.wire.sectionDivisor);
            //if (this.nSegments < 4) { this.nSegments = 4; } else if (this.nSegments > 15) { this.nSegments = 15; }

            for (var i = 1; i <= this.nSegments; i++) {
                var x = (this.x + this.game.$settings.wire.distanceX) + 
                        i / this.nSegments * (this.anchorPoint.x -
                        (this.x + this.game.$settings.wire.distanceX));


                var y = this.y + i / this.nSegments * (this.anchorPoint.y - this.y);

                if (this.anchorBody == null) {
                    x += this.game.rnd.realInRange(-50, 50);
                } 

                var w = this.wireSegments.create(x, y);
                this.game.physics.p2.enable(w, this.game.$settings.debug);
                w.key = 'wire';
                w.body.setCircle(5);
                w.body.setCollisionGroup(this.game.wireCG);
                w.body.collides([this.game.spriteCG, this.game.dummyCG]);

                if (this.anchorBody) {
                    w.body.mass = this.game.$settings.wire.mass;
                } else {
                    w.body.mass = .2;
                }

                w.body.fixedRotation = true;
                w.body.data.gravityScale = this.game.$settings.wire.bungeeFactor;
            }

            if (this.anchorBody) {
                this.anchorBodyOffset = [this.anchorBody.x - this.wireSegments.children[this.nSegments - 1].x,
                this.anchorBody.y - this.wireSegments.children[this.nSegments - 1].y];
            }

            this.UpdateWire();
        }
    }

    UpdateWire() {
        this.wireTimer++;
        this.wireBitmap.clear();

        var y = 1 / this.game.height;
        var wx = [this.x + this.game.$settings.wire.distanceX];
        var wy = [this.y];

        for (var i = 0; i < (this.nSegments - 1); i++) {
            wx.push(this.wireSegments.children[i + 1].x);
            wy.push(this.wireSegments.children[i + 1].y);
        }

        for (var i = 0; i <= 1.; i += y) {
            var px = this.game.math.catmullRomInterpolation(wx, i);
            var py = this.game.math.catmullRomInterpolation(wy, i);

            this.wireBitmap.rect(px, py, this.game.$settings.wire.width, 1, this.game.$settings.wire.color);

            if (py % 16 < 0.5) {
                var rx = Math.round(px);
                var ry = Math.round(py);
                if (this.game.terrain.getPixelRGB(rx + 16, ry).a > 0. &&
                    this.game.terrain.getPixelRGB(rx + 25, ry).a > 0. &&
                    this.game.physics.p2.hitTest(new Phaser.Point(rx + 16, ry)).length == 0) {
                    new Dummy(this.game, rx + 25, ry);
                } else if (this.game.terrain.getPixelRGB(rx - 16, ry).a > 0. &&
                    this.game.terrain.getPixelRGB(rx - 25, ry).a > 0. &&
                    this.game.physics.p2.hitTest(new Phaser.Point(rx - 16, ry)).length == 0) {
                    new Dummy(this.game, rx - 25, ry);
                }

                if (this.game.terrain.getPixelRGB(rx, ry - 16).a > 0. &&
                    this.game.terrain.getPixelRGB(rx, ry - 25).a > 0. &&
                    this.game.physics.p2.hitTest(new Phaser.Point(rx, ry - 16)).length == 0) {
                    new Dummy(this.game, rx, ry - 25);
                } else if (this.game.terrain.getPixelRGB(rx, ry + 16).a > 0. &&
                    this.game.terrain.getPixelRGB(rx, ry + 25).a > 0. &&
                    this.game.physics.p2.hitTest(new Phaser.Point(rx, ry + 16)).length == 0) {
                    new Dummy(this.game, rx, ry + 25);
                }
            }
        }




        var r = 3 * (Math.sin((this.wireTimer / 36) * 2 * Math.PI) + 1) + 3;
        //this.wireBitmap.circle(this.wireSegments.children[this.nSegments - 1].x, this.wireSegments.children[this.nSegments - 1].y, r + 4, this.game.$settings.wire.color);
        //this.wireBitmap.circle(this.x + this.game.$settings.wire.distanceX, this.y, r, this.game.$settings.wire.color);

        this.ClearWireConstraints();

        if (this.distanceToAnchor >= this.game.$settings.wire.maxDistance) {
            this.distanceToAnchor -= this.distanceToAnchor * 0.0085;
        }

        this.constraints.push(this.game.physics.p2.createDistanceConstraint(this, this.wireSegments.children[0], this.distanceToAnchor / (this.nSegments), [this.game.$settings.wire.distanceX, 0]));
        for (var i = 0; i < (this.nSegments - 1); i++) {
            this.constraints.push(this.game.physics.p2.createDistanceConstraint(this.wireSegments.children[i + 1], this.wireSegments.children[i], this.distanceToAnchor / (this.nSegments)));
        }
        if (this.anchorBody) {
            this.constraints.push(this.game.physics.p2.createLockConstraint(this.anchorBody, this.wireSegments.children[this.nSegments - 1], this.anchorBodyOffset));
        }
    }

    ClearWireConstraints() {
        for (var i = 0; i <= this.constraints.length; i++) { this.game.physics.p2.removeConstraint(this.constraints[i]); }
        this.constraints = [];
    }

    DestroyWire() {
        this.indicator.alpha = 0;

        // reset wire stuff
        this.wireTimer = 0;
        this.ClearWireConstraints();
        this.wireSegments.destroy(true, true);  // destroy children, dont destroy group
        this.wireBitmap.clear();

        // TODO: maybe add explosions

        this.anchorBody = undefined;
    }



}

export default Player