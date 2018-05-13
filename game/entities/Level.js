import '~/game/PhaserBridge'

import Obstacle from '~/game/entities/Obstacle'

class Level extends Phaser.Sprite {

    constructor(game, level) {
        super(game, 0, 0);
        game.add.existing(this);

        this.game = game;
        this.level = level;

        this.elements = [];

        this.CreateElements();
    }

    CreateElements(){
        this.level.elements.forEach((element) => {
            switch(element.objectType){
                case 'obstacles':
                    this.elements.push(new Obstacle(this.game, element));
                break;

                case 'startend':

                break;
            }
        });
    }


}

export default Level;