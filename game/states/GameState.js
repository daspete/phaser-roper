import '~/game/PhaserBridge'

import Background from '~/game/entities/Background'
import Player from '~/game/entities/Player'
import Cloud from '~/game/entities/Cloud'
import Level from '~/game/entities/Level'

class GameState extends Phaser.State {

    preload() {
        this.load.physics('elementphysics', 'assets/level/elementphysics.json');

        this.level = this.game.$settings.levels[this.game.currentLevel];
        this.game.$page.SetLevel(this.level);

        for(let i = 0; i < this.level.elements.length; i++){
            this.load.image(
                this.level.elements[i].type,
                this.level.elements[i].file
            );
        }
    }

    create() {
        if(this.game.$settings.fps){
            this.game.time.advancedTiming = true;
        }
        this.game.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.game.world.setBounds(0, 0, this.level.width, this.level.height);
        this.width = this.game.world.bounds.width;
        this.height = this.game.world.bounds.height;

        this.game.background = new Background(this.game, this.width, this.height);

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1400;

        this.game.spriteCG = this.physics.p2.createCollisionGroup();
        this.game.ropeCG = this.physics.p2.createCollisionGroup();
        this.game.dummyCG = this.physics.p2.createCollisionGroup();
        this.game.gemCG = this.physics.p2.createCollisionGroup();

        this.physics.p2.updateBoundsCollisionGroup();

        this.game.level = new Level(this.game, this.level);

        let startElement = this.level.elements.find((element) => {
            return element.start == true;
        });

        this.game.player = new Player(this.game, startElement.position.x + 150, startElement.position.y - 300);
        this.game.player.body.setCollisionGroup(this.game.spriteCG);
        this.game.player.body.collides(this.game.spriteCG);

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
            

            this.game.player.allowAction = false;
            this.game.player.body.velocity.x = 0;
            this.game.player.body.velocity.y = 0;

            this.game.player.frame = 0;

            this.WinGame();
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

    WinGame(){
        if(this.game.currentLevel >= this.game.$settings.levels.length - 1){
            this.state.start('MainMenu');
        }else{
            this.game.currentLevel++;
            this.state.start('Game');
        }
    }

}

export default GameState;