import '~/game/PhaserBridge'

class PreloadState extends Phaser.State {

    preload(){
        this.load.spritesheet('player', 'assets/player.png', 52, 72);
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('indicator', 'assets/indicator.png');
        this.load.image('hud_gem', 'assets/hud_gem.png');
        this.load.image('gem', 'assets/gem.png');
		this.load.image('bullet', 'assets/bullet.png');
    }

    create(){
        this.state.start('MainMenu');
    }

}

export default PreloadState;