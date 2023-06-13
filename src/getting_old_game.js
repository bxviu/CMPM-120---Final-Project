class Cinematic extends Phaser.Scene {
    constructor ()
    {
        super('cinematic');
    }

    init (data)
    {
        this.data = Object.keys(data).length === 0 ? {limit: 10} : data;
    }
    create ()
    {
        const text = this.add.text(400, 300, 'Cinematics', { align: 'center' }, 0xFF69B4);
        text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

        text.setOrigin(0.5, 0.5);
        text.setResolution(window.devicePixelRatio);
        text.setFontFamily('Arial');
        text.setFontStyle('bold');
        text.setFontSize(100);

        text.preFX.setPadding(32);

        const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);

        // adding start button 
        console.log(this.data)
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('gameplay', this.data));
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',//'#257098',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 } // Top down game, so no gravity
        },
    },
    scene: [Cinematic, Gameplay, Inventory, Statistics]
};

const game = new Phaser.Game(config);
