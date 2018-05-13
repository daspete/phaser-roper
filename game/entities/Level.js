import '~/game/PhaserBridge'

import Obstacle from '~/game/entities/Obstacle'
import StartPlatform from '~/game/entities/StartPlatform'
import EndPlatform from '~/game/entities/EndPlatform'

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
                    if(element.start == true){
                        this.elements.push(new StartPlatform(this.game, element));
                    }else{
                        this.elements.push(new EndPlatform(this.game, element));
                    }
                break;
            }
        });
    }


}

export default Level;