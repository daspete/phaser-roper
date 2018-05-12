import '~/game/PhaserBridge'

class PreloadState extends Phaser.State {

    preload(){
        this.load.spritesheet('player', 'assets/player.png', 52, 72);
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('gem', 'assets/gem.png');
        this.load.image('rope', 'assets/rope.png');

        this.load.image('layer1', 'assets/layers/layer1.png');
        this.load.image('layer2', 'assets/layers/layer2.png');
        this.load.image('layer3', 'assets/layers/layer3.png');
        this.load.image('layer4', 'assets/layers/layer4.png');
        this.load.image('layer5', 'assets/layers/layer5.png');
        this.load.image('layer6', 'assets/layers/layer6.png');
        this.load.image('layer7', 'assets/layers/layer7.png');
        this.load.image('layer8', 'assets/layers/layer8.png');
    }

    create(){
        this.state.start('MainMenu');
    }

}

export default PreloadState;