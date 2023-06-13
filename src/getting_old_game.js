    // import HelperScene from '../helper.js';

    window.visits = 0;

    class Title extends Phaser.Scene
    {   
        constructor() {
            super('title')
        }
        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 60} : data;
        }
        create ()
        {
            
            const text = this.add.text(400, 300, 'Title Scene \n-dex was here', { align: 'center' }, 0xFF69B4);
            text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

            text.setOrigin(0.5, 0.5);
            text.setResolution(window.devicePixelRatio);
            text.setFontFamily('Arial');
            text.setFontStyle('bold');
            text.setFontSize(100);
            text.preFX.setPadding(32);
            const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);

            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('transition1', this.data));
            });
        }
    }
    class Transition1 extends Phaser.Scene
    {   
        constructor() {
            super('transition1')
        }
        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 90} : data;
        }
        create ()
        {
            

            const text = this.add.text(400, 300, 'Transition 1', { align: 'center' }, 0xFF69B4);
            text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

            text.setOrigin(0.5, 0.5);
            text.setResolution(window.devicePixelRatio);
            text.setFontFamily('Arial');
            text.setFontStyle('bold');
            text.setFontSize(100);
            text.preFX.setPadding(32);
            const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);

            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('gameplay', this.data));
            });
        }
    }
    class Transition2 extends Phaser.Scene
    {   
        constructor() {
            super('transition2')
        }
        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 90} : data;
        }
        create ()
        {
            

            const text = this.add.text(400, 300, 'Transition 2 \n 20 years later', { align: 'center' }, 0xFF69B4);
            text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

            text.setOrigin(0.5, 0.5);
            text.setResolution(window.devicePixelRatio);
            text.setFontFamily('Arial');
            text.setFontStyle('bold');
            text.setFontSize(100);
            text.preFX.setPadding(32);
            const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('gameplay', this.data));
            });
        }
    }
    class Transition3 extends Phaser.Scene
    {   
        constructor() {
            super('transition3')
        }
        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 90} : data;
            // console.log(this.data);
        }
        create ()
        {
            

            const text = this.add.text(400, 300, 'Transition 3 \n 40 years later', { align: 'center' }, 0xFF69B4);
            text.setTint(0xFF69B4, 0xFFC0CB, 0x9F2B68, 0xE30B5C);

            text.setOrigin(0.5, 0.5);
            text.setResolution(window.devicePixelRatio);
            text.setFontFamily('Arial');
            text.setFontStyle('bold');
            text.setFontSize(100);
            text.preFX.setPadding(32);
            const fx = text.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);

            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('gameplay', this.data));
            });
        }
    }
    class End extends Phaser.Scene
    {   
        totalSteps = 20;
        totalMems = 7;
        totalTime = 100;
        constructor() {
            super('end')
        }
        
        create ()
        {
            this.w = this.game.config.width;
            this.h = this.game.config.height;

            this.label = this.add.text(100, 100, '')
    		.setWordWrapWidth(this.w*14/16)
            .setFontSize(this.w/20)
            .setTint(0x869d4d)

    	    this.typewriteTextWrapped('I wonder.... \nWhat else is out there???\n\nThe End\n\n\n\nClick to Continue')


            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('credits'));
            });
        }
        typewriteText(text)
        {
            const length = text.length
            let i = 0
            this.time.addEvent({
                callback: () => {
                    this.label.text += text[i]
                    ++i
                },
                repeat: length - 1,
                delay: 200
            })
        }
        typewriteTextWrapped(text)
        {
            const lines = this.label.getWrappedText(text)
            const wrappedText = lines.join('\n')

            this.typewriteText(wrappedText)
        }
    }
    class Credits extends Phaser.Scene
    {   
        constructor() {
            super('credits')
        }
        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 90} : data;
        }
        preload () {
            this.load.path = './assets/images/';
            this.load.image('qrcode', 'qrcode_toStats.png');
            this.load.image('xButton', 'xButton.png');

            this.load.path = './assets/sounds/';
            this.load.audio('plink', "plink.mp3")
        }
        create ()
        {
            this.w = this.game.config.width;
            this.h = this.game.config.height;

            const text = this.add.text(this.w/2, this.h*1/8, "Credits");
            text.setOrigin(0.5);
            text.setFontSize(this.w/20);
            text.setTint(0x869d4d);  
            //Production Lead: Dexter Zhang\nBackup Tech: Michael Law\nBackup Testing: George Gomez

            const text1 = this.add.text(this.w/12, this.h*1/4, 'Technology Lead');
            text1.setFontSize(this.w/35);
            text1.setTint(0x869d4d);  

            const text2 = this.add.text(this.w/12, this.h*5/16, 'Testing Lead');
            text2.setFontSize(this.w/35);
            text2.setTint(0x869d4d);  

            const text3 = this.add.text(this.w/12, this.h*6/16, 'Production Lead');
            text3.setFontSize(this.w/35);
            text3.setTint(0x869d4d);

            const text4 = this.add.text(this.w/12, this.h*7/16, 'Backup Tech');
            text4.setFontSize(this.w/35);
            text4.setTint(0x869d4d);

            // const text5 = this.add.text(this.w/12, this.h*8/16, 'Backup Testing');
            // text5.setFontSize(this.w/35);
            // text5.setTint(0x869d4d);

            
            const text12 = this.add.text(this.w*6.5/10, -50, "Benthan Vu");
            text12.setFontSize(this.w/35);
            text12.setTint(0x869d4d);

            const text22 = this.add.text(this.w*6.5/10, this.h + 50, "Kyler Mekmorakoth");
            text22.setFontSize(this.w/35);
            text22.setTint(0x869d4d);

            const text32 = this.add.text(-200, this.h*6/16, "Dexter Zhang");
            text32.setFontSize(this.w/35);
            text32.setTint(0x869d4d);

            const text42 = this.add.text(this.w*6.5/10, -50, "Michael Law");
            text42.setFontSize(this.w/35);
            text42.setTint(0x869d4d);

            const text52 = this.add.text(-200, this.h*8/16, "George Gomez");
            text52.setFontSize(this.w/35);
            text52.setTint(0x869d4d);

            const text31 = this.add.text(this.w/2, 800, "QR Code to see Global Player Statistics");
            text31.setFontSize(this.w/35);
            text31.setTint(0x869d4d).setOrigin(0.5);

            const image32 = this.add.image(this.w/2, 800, 'qrcode').setScale(0.4);

            // add clickable link to https://cmpm-120-final---long-time-statistics.glitch.me/
            const text33 = this.add.text(this.w/2, 800, "Or click here!");
            text33.setFontSize(this.w/35);
            text33.setOrigin(0.5);
            text33.setInteractive({usehandCursor: true});
            text33.on('pointerdown', () => {
                window.open("https://cmpm-120-final---long-time-statistics.glitch.me/", "_blank");
            })
            .on('pointerover', () => text33.setStyle({ fill: '#0af' }))
            .on('pointerout', () => text33.setStyle({ fill: '#fff' }));

            this.xButton = this.add.image(this.w+100, 40, "xButton").setScale(1).setOrigin(0.5).setDepth(10);

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
                        x: this.w*6.5/10,
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
                        x: this.w*6.5/10,
                        flipX: false,
                        yoyo: false,
                        duration: 1200,
                        ease: 'quad.out'
                    },
                    {
                        targets: image32,
                        y: this.h/2+50,
                        duration: 1200,
                        ease: 'quad.out'
                    },
                    {
                        targets: text31,
                        y: this.h/2+190,
                        duration: 1200,
                        ease: 'quad.out'
                    },
                    {
                        targets: text33,
                        y: this.h/2+220,
                        duration: 1200,
                        ease: 'quad.out'
                    },
                    {
                        targets: this.xButton,
                        x: this.w-40,
                        duration: 1200,
                        ease: 'quad.out',
                        onComplete: () => {
                            this.xButton.setInteractive({useHandCursor: true});
                            this.xButton.on('pointerdown', () => {
                                this.tweens.add({
                                    targets: this.xButton,
                                    scaleX: 0.9,
                                    scaleY: 0.9,
                                    duration: 100,
                                    ease: 'Power2',
                                    yoyo: true,
                                    repeat: 0
                                    });
                                this.sound.add('plink', { loop: false }).play();
                                this.cameras.main.fade(1000, 0,0,0);
                                this.time.delayedCall(1000, () => {
                                    window.visits = 0;
                                    this.scene.start('title',{})
                                });
                            })
                            .on('pointerover', () => {
                                this.tweens.add({
                                    targets: this.xButton,
                                    angle: -180,
                                    duration: 200,
                                    ease: 'Power2',
                                    alpha: 1
                                });
                            })
                            .on('pointerout', () => {
                                this.tweens.add({
                                    targets: this.xButton,
                                    angle: 0,
                                    duration: 200,
                                    ease: 'Power2',
                                    alpha: 0.5
                                });
                            });
                        }
                    }
                ],
                loop: 0,
                loopDelay: 300,
            });
            

            // this.input.on('pointerdown', () => {
            //     this.cameras.main.fade(1000, 0,0,0);
            //     this.time.delayedCall(1000, () => this.scene.start('title', this.data));
            // });
            // working on in the scene-flow-1 html.
        }
    }

    class Cinematic extends Phaser.Scene {
        constructor ()
        {
            super('cinematic');
        }

        init (data)
        {
            this.data = Object.keys(data).length === 0 ? {limit: 90} : data;
        }
        create ()
        {
            window.visits ++;
            if(window.visits == 1){
                this.time.delayedCall(1000, () => this.scene.start('transition2', this.data));
            }
            if(window.visits == 2){
                this.time.delayedCall(1000, () => this.scene.start('transition3', this.data));
            }
            if(window.visits == 3){
                this.time.delayedCall(1000, () => this.scene.start('end', this.data));
            }
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
        // scene: [Credits, Transition1, Transition2, End, Transition3,  , Cinematic, Gameplay, Inventory, Statistics]
        scene: [Title, Transition1, Transition2, End, Transition3,  Credits, Cinematic, Gameplay, Inventory, Statistics]
    };

    const game = new Phaser.Game(config);
