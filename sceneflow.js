class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
    }
    
    create ()
    {
        

        const text = this.add.text(400, 300, 'Path of Purity\n Scene Flow', { align: 'center' }, 0xFF69B4);
        text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

        text.setOrigin(0.5, 0.5);
        text.setResolution(window.devicePixelRatio);
        text.setFontFamily('Arial');
        text.setFontStyle('bold');
        text.setFontSize(100);

        text.preFX.setPadding(32);

        const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);

        // adding start button 

        
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('stat'));
        });
    }
}
class Stat extends Phaser.Scene
{   
    stuff = 5;
    constructor() {
        super('stat')
    }
    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        const text = this.add.text(this.w/2, this.h*1/8, "Statistics", { align: 'center' }, 0xFF69B4);
        text.setFontSize(this.w/20);
        text.setTint(0x000000);  

        const text1 = this.add.text(this.w/5, this.h*1/4, 'You walked ' + this.stuff + " steps", { align: 'center' }, 0xFF69B4);
        text1.setFontSize(this.w/40);
        text1.setTint(0x000000);  

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('victory'));
        });
    }
}

class Victory extends Phaser.Scene{
    constructor() {
        super('victory');
    }
    
    create() {
        const text = this.add.text(400, 150, 'Congrats you win!', { align: 'center' }, 0xFF69B4);
        text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);
        text.setOrigin(0.5, 0.5);
        text.setResolution(window.devicePixelRatio);
        text.setFontFamily('Arial');
        text.setFontStyle('bold');
        text.setFontSize(100);

        text.preFX.setPadding(32);

        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#869d4d',
    parent: 'phaser-example',
    scene: [Intro, Stat, Victory]
};

const game = new Phaser.Game(config);
