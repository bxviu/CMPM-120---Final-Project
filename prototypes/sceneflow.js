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
    totalSteps = 20;
    totalMems = 7;
    totalTime = 100;
    constructor() {
        super('stat')
    }
    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        const text = this.add.text(this.w/2, this.h*1/8, "Statistics");
        text.setOrigin(0.5);
        text.setFontSize(this.w/20);
        text.setTint(0x000000);  

        const stepsText1 = this.add.text(this.w/12, this.h*1/4, 'Steps walked ');
        stepsText1.setFontSize(this.w/40);
        stepsText1.setTint(0x000000);  

        const stepsText2 = this.add.text(this.w*4/5, this.h*1/4, this.totalSteps);
        stepsText2.setFontSize(this.w/40);
        stepsText2.setTint(0x000000);

        const memsText1 = this.add.text(this.w/12, this.h*5/16, 'Memories examined');
        memsText1.setFontSize(this.w/40);
        memsText1.setTint(0xFFFFFF);  

        const memsText2 = this.add.text(this.w*4/5, this.h*5/16, this.totalMems);
        memsText2.setFontSize(this.w/40);
        memsText2.setTint(0xFFFFFF);

        const timeText1 = this.add.text(this.w/12, this.h*6/16, 'Total Time Spent');
        timeText1.setFontSize(this.w/40);
        timeText1.setTint(0x000000);  

        const timeText2 = this.add.text(this.w*4/5, this.h*6/16, this.totalTime + " min");
        timeText2.setFontSize(this.w/40);
        timeText2.setTint(0x000000);

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('credits'));
        });
    }
}
class Credits extends Phaser.Scene
{   
    constructor() {
        super('credits')
    }
    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        const text = this.add.text(this.w/2, this.h*1/8, "Credits");
        text.setOrigin(0.5);
        text.setFontSize(this.w/20);
        text.setTint(0x000000);  
        //Production Lead: Dexter Zhang\nBackup Tech: Michael Law\nBackup Testing: George Gomez

        const text1 = this.add.text(this.w/12, this.h*1/4, 'Technology Lead');
        text1.setFontSize(this.w/35);
        text1.setTint(0x000000);  

        const text2 = this.add.text(this.w/12, this.h*5/16, 'Testing Lead');
        text2.setFontSize(this.w/35);
        text2.setTint(0x000000);  

        const text3 = this.add.text(this.w/12, this.h*6/16, 'Production Lead');
        text3.setFontSize(this.w/35);
        text3.setTint(0x000000);

        const text4 = this.add.text(this.w/12, this.h*7/16, 'Backup Tech');
        text4.setFontSize(this.w/35);
        text4.setTint(0x000000);

        const text5 = this.add.text(this.w/12, this.h*8/16, 'Backup Testing');
        text5.setFontSize(this.w/35);
        text5.setTint(0x000000);

        
        const text12 = this.add.text(this.w*7/10, -50, "Benthan Vu");
        text12.setFontSize(this.w/35);
        text12.setTint(0x000000);

        const text22 = this.add.text(this.w*7/10, this.h + 50, "Kyler Mekmorakoth");
        text22.setFontSize(this.w/35);
        text22.setTint(0x000000);

        const text32 = this.add.text(-200, this.h*6/16, "Dexter Zhang");
        text32.setFontSize(this.w/35);
        text32.setTint(0x000000);

        const text42 = this.add.text(this.w*7/10, -50, "Michael Law");
        text42.setFontSize(this.w/35);
        text42.setTint(0x000000);

        const text52 = this.add.text(-200, this.h*8/16, "George Gomez");
        text52.setFontSize(this.w/35);
        text52.setTint(0x000000);


        const chain1 = this.tweens.chain({
            targets: text12,
            tweens: [
                {
                    y: this.h*1/4,
                    flipX: false,
                    yoyo: false,
                    duration: 1000,
                    ease: 'quad.out'
                },
                {
                    targets: text22,
                    y: this.h*5/16,
                    flipX: false,
                    yoyo: false,
                    duration: 1200,
                    ease: 'quad.out'
                },
                {
                    targets: text32,
                    x: this.w*7/10,
                    flipX: false,
                    yoyo: false,
                    duration: 1200,
                    ease: 'quad.out'
                },
                {
                    targets: text42,
                    y: this.h*7/16,
                    flipX: false,
                    yoyo: false,
                    duration: 1200,
                    ease: 'quad.out'
                },
                {
                    targets: text52,
                    x: this.w*7/10,
                    flipX: false,
                    yoyo: false,
                    duration: 1200,
                    ease: 'quad.out'
                },

            ],
            loop: 0,
            loopDelay: 300,
        });
        

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('victory'));
        });
        // working on in the scene-flow-1 html.
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
    scene: [Intro, Stat, Credits, Victory]
};

const game = new Phaser.Game(config);
