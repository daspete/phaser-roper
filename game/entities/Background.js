import '~/game/PhaserBridge'

class Background {

    constructor(game, width, height){
        this.layers = [
            game.add.tileSprite(0, 0, 1280, 720, 'layer1'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer2'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer3'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer4'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer5'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer6'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer7'),
            game.add.tileSprite(0, 0, 1280, 720, 'layer8')
        ]

        for(let i = 0; i < this.layers.length; i++){
            this.layers[i].fixedToCamera = true;
            this.layers[i].sendToBack();
        }

        this.game = game;

        this.oldPosition = {
            x: this.game.camera.x,
            y: this.game.camera.y
        };

    }

    update(){
        let position = {
            x: this.game.camera.x,
            y: this.game.camera.y
        };

        let distanceX = this.game.camera.x - this.oldPosition.x;
        let distanceY = this.game.camera.y - this.oldPosition.y;

        

        for(let i = 0; i < this.layers.length; i++){
            this.layers[i].tilePosition.x -= distanceX * (this.layers.length - i) * 0.06;
            this.layers[i].tilePosition.y -= distanceY * (this.layers.length - i) * 0.1;
        }

        

        this.oldPosition = position;
    }
}

export default Background;