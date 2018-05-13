import '~/game/PhaserBridge'

import Background from '~/game/entities/Background'
import Player from '~/game/entities/Player'
import Cloud from '~/game/entities/Cloud'
import Level from '~/game/entities/Level'

class GameState extends Phaser.State {

    preload() {
        this.load.image('terrain', 'assets/levels/terrain0.png');
        this.load.json('positions', 'assets/levels/positions0.json');

        this.load.physics('elementphysics', 'assets/level/elementphysics.json');

        for(let i = 0; i < this.game.$settings.level.elements.length; i++){
            this.load.image(
                this.game.$settings.level.elements[i].type,
                this.game.$settings.level.elements[i].file
            );
        }
    }

    create() {
        if(this.game.$settings.fps){
            this.game.time.advancedTiming = true;
        }
        this.game.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.game.world.setBounds(0, 0, 8000, 1000);
        this.width = this.game.world.bounds.width;
        this.height = this.game.world.bounds.height;

        this.game.background = new Background(this.game, this.width, this.height);

        // this.game.terrain = this.game.add.bitmapData(this.width, this.height);
        // this.game.terrain.addToWorld();
        // this.game.terrain.draw('terrain', 0, 0);
        // this.game.terrain.update();
        

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1400;

        this.game.spriteCG = this.physics.p2.createCollisionGroup();
        this.game.ropeCG = this.physics.p2.createCollisionGroup();
        this.game.dummyCG = this.physics.p2.createCollisionGroup();
        this.game.gemCG = this.physics.p2.createCollisionGroup();

        this.physics.p2.updateBoundsCollisionGroup();

        this.positions = this.cache.getJSON('positions');

        this.game.level = new Level(this.game, this.game.$settings.level);

        this.game.player = new Player(this.game, this.positions.start.x, this.positions.start.y - 100);
        this.game.player.body.setCollisionGroup(this.game.spriteCG);
        this.game.player.body.collides(this.game.spriteCG);

        // this.startCloud = new Cloud(this.game, this.positions.start.x, this.positions.start.y);
        // this.startCloud.body.setCollisionGroup(this.game.spriteCG);
        // this.startCloud.body.collides(this.game.spriteCG);

        // this.finishCloud = new Cloud(this.game, this.positions.finish.x, this.positions.finish.y);
        // this.finishCloud.body.setCollisionGroup(this.game.spriteCG);
        // this.finishCloud.body.collides(this.game.spriteCG);

        this.game.camera.follow(this.game.player);
        this.timer = 0;
        this.timer2 = 0;
        this.game.playerHasMoved = false;
        this.game.playerWins = false;

        this.game.score = 0;
    }

    update() {
        if (!this.game.playerHasMoved && (this.input.pointer1.isDown || this.game.spacebar.isDown)) {
            this.game.playerHasMoved = true;
        }

        if (!this.game.player.playerAlive) {
            this.game.player.frame = 2;
            this.QuitGame(); 
        }

        if (this.game.playerWins) {
            this.QuitGame();

            this.game.player.allowAction = false;
            this.game.player.body.velocity.x = 0;
            this.game.player.body.velocity.y = 0;

            this.game.player.frame = 0;
        }

        this.timer++;
    }

    render(){
        if(this.game.$settings.fps){
            this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00"); 
        }
    }

    QuitGame(){
        this.timer2++;
        if(this.timer2 > 30 && this.input.pointer1.isDown || this.game.spacebar.isDown){
            this.state.start('MainMenu');
        }
    }


}

export default GameState;