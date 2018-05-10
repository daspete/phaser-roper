import '~/game/PhaserBridge'

class Background {

    constructor(game, width, height){
        this.background = game.add.bitmapData(width, height);
        this.background.addToWorld();

        var n = height * 0.1 + 1;
        var y = 0;

        for(let i = 0; i < n; i++){
            let color = Phaser.Color.interpolateColor(0xaaccff, 0x3377dd, n, i);
            
            this.background.rect(0, y, width, y + 10, Phaser.Color.getWebRGB(color));

            y += 10;
        }
    }
}

export default Background;