import '~/game/PhaserBridge'

import Background from '~/game/utils/Background'

class MainMenuState extends Phaser.State {

    create(){
        this.background = new Background(this.game, this.game.width, this.game.height);
        this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // while developing
        this.StartGame();
    }

    update(){
        if(this.spacebar.isDown){
            this.StartGame();
        }
    }



    StartGame(){
        this.state.start('Game');
    }

}

export default MainMenuState;