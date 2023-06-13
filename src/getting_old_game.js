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
        preload(){
            this.load.image('ball', './assets/items/Basketball.png');
            this.load.image('cap', './assets/items/Baseball Cap.png');
            this.load.spritesheet('playerDown', './assets/images/character/ACharDown.png', { frameWidth: 14, frameHeight: 19 });
        }
        idleMotionTween(object, x, y){
            this.tweens.chain({
                targets: object,
                repeat: -1,
                tweens:[
                {x: x+Phaser.Math.Between(0,4),y:y+Phaser.Math.Between(-4,4),ease:"sine.inout",duration:3000, delay:Phaser.Math.Between(0,1000), yoyo: true},
                {x: x-Phaser.Math.Between(0,4),y:y+Phaser.Math.Between(-4,4),ease:"sine.inout",duration:3000, delay:Phaser.Math.Between(0,1000), yoyo:true},
            ]});
        }
        hoverInteract(text){
            text.on("pointerover",()=>{
                text.setColor("#ffffff");
            })
            text.on("pointerout",()=>{
                text.setColor("#EDC02C");
            })
        }
        create ()
        {
            // background
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);

            // screensaver objects
            let recPosX = Phaser.Math.Between(100,700);
            let recPosY = Phaser.Math.Between(100,700);
            this.screensaver1 = this.physics.add.image(recPosX, recPosY, "cap");
            this.screensaver1.setGravity(0, 0).setBounce(1).setCollideWorldBounds(true).setVelocity(200);
            
            // i would make the items bigger but this is ok for now
            let circlePosX = Phaser.Math.Between(100,700);
            let circlePosY = Phaser.Math.Between(50,100);
            this.screensaver2 = this.physics.add.image(recPosX, recPosY, "ball");
            this.screensaver2.setCircle(15).setGravity(0, 100).setBounce(1).setCollideWorldBounds(true).setVelocity(-200,-200).setOrigin(0.5,0.5);
            
            // procedural logo
            // no tweens because then i would have to match up all of these shapes and the time constraint does not allow for it at present time
            let logoX = 500;
            let logoY = 100;
            let logoColor = 0xEDC02C;
            let word1X = logoX - 450;
            let word1Y = logoY;
            let word1Space = 100;
            let word1 = {
                l1: this.add.rectangle(word1X, word1Y-8, 20, 60, logoColor),
                l2: this.add.rectangle(word1X + 20, word1Y + 30, 60, 20, logoColor),
                o: this.add.circle(word1X + word1Space , word1Y, 40, logoColor),
                n1: this.add.arc(word1X+word1Space*2, word1Y, 40, 0, 180, true, logoColor),
                n2: this.add.rectangle(word1X+word1Space*2-28, word1Y+20, 25, 40, logoColor),
                n3: this.add.rectangle(word1X+word1Space*2+28, word1Y+20, 25, 40, logoColor),
                g1: this.add.circle(word1X+word1Space*3,word1Y, 40, logoColor),
                g2: this.add.rectangle(word1X+word1Space*3+25, word1Y+35, 30, 60, logoColor),
                g3: this.add.arc(word1X+word1Space*3+15, word1Y+65, 25, 0, 180, false, logoColor),
            }
            let word2X = logoX;
            let word2Y = logoY;
            let word2Space = 100;
            let word2 = {
                d1: this.add.arc(word2X, word2Y, 40, 90, 270, true, logoColor),
                d2: this.add.rectangle(word2X-15, word2Y, 30, 80, logoColor),
                a1: this.add.circle(word2X + word2Space, word2Y, 40, logoColor),
                a2: this.add.rectangle(word2X+word2Space+20, word2Y+20, 40, 40, logoColor),
                y1: this.add.arc(word2X+word2Space*2,word2Y,40, 0, 180, false, logoColor),
                y2: this.add.rectangle(word2X+word2Space*2-28,word2Y-20,25,40,logoColor),
                y3: this.add.rectangle(word2X+word2Space*2+28,word2Y-20,25,40,logoColor),
                y4: this.add.rectangle(word2X+word2Space*2+28,word2Y+20,25,80,logoColor),
                y5: this.add.arc(word2X+word2Space*2+15, word2Y+60, 25, 0, 180, false, logoColor),
            }

            // text
            const start = this.add.text(400, 250, "Begin living", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();
            const inventory = this.add.text(400, 300, "View your memories", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();
            const credits = this.add.text(400, 350, "Credits", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();

            // tweens for the buttons to move slightly, and maybe intrigue the player
            this.idleMotionTween(start, 400, 250);
            this.idleMotionTween(inventory, 400, 300);
            this.idleMotionTween(credits, 400, 350);

            this.hoverInteract(start);
            this.hoverInteract(inventory);
            this.hoverInteract(credits);

            start.on("pointerdown", ()=>{
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('transition1'));
            });
            inventory.on("pointerdown", ()=>{
                // this.cameras.main.fade(1000, 0,0,0);
                // this.time.delayedCall(1000, () => this.scene.start('transition2'));
                window.open("https://cmpm-120-final---long-time-statistics.glitch.me/", "_blank");
            });
            credits.on("pointerdown", ()=>{
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('credits'));
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
        fadeInTween(object){
            this.tweens.add({
                targets: object,
                alpha: { from: 0, to: 1 },
                ease: 'Sine.InOut',
                duration: 1000,
            });
        }
        hoverInteract(text){
            text.on("pointerover",()=>{
                text.setColor("#ffffff");
            })
            text.on("pointerout",()=>{
                text.setColor("#EDC02C");
            })
        }
        
        create ()
        {
            this.counter = 0;
            this.cameras.main.fadeIn(500, 0, 0, 0);
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);
            const par1 = this.add.text(400, 150, "You've come home from a busy day at school.\nYour parents are proud\nYou've finished your second year of school.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
            const par2 = this.add.text(400, 300, "Now here you stand at home,\nTwo months of summer break!\nWith a long time to explore limitless possibilities.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
            const par3 = this.add.text(400, 400, "Click here to begin...", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
            par1.setAlpha(0);
            par2.setAlpha(0);
            par3.setAlpha(0);
            par3.setInteractive();
            this.tweens.add({
                targets: par1,
                alpha: { from: 0, to: 1 },
                ease: 'Sine.InOut',
                duration: 1000,
            });
            this.tweens.add({
                delay: 1500,
                targets: par2,
                alpha: { from: 0, to: 1 },
                ease: 'Sine.InOut',
                duration: 1000,
            });
            this.tweens.add({
                delay: 3000,
                targets: par3,
                alpha: { from: 0, to: 1 },
                ease: 'Sine.InOut',
                duration: 1000,
            });
            this.hoverInteract(par3);

            // walking character sprite
            this.anims.create({
                key: 'idle',
                frames: this.anims.generateFrameNumbers("playerDown", { start: 0, end: 3 }),
                delay: 0,
                duration: null,
                frameRate: 6,
                repeat: -1,
            })
            let walking = this.add.sprite(675, 500, "playerDown");
            walking.setScale(7).play('idle');

            // note: it is possible for people to skip the cutscene because of this, might change in the future
            par3.on("pointerdown",()=>{
                this.time.delayedCall(1000, () => this.scene.start('gameplay', {limit: 60}));
            })
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
            
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);
            this.cameras.main.fadeIn(500, 0, 0, 0);
            const par1 = this.add.text(400, 300, "20 Years Later...", 
            {align: "center",fontFamily:"Baskerville",
            fontStyle:"bold",fontSize:100,
            color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);

            const par2 = this.add.text(400, 400, "click to continue", 
            {align: "center",fontFamily:"Baskerville",
            fontStyle:"bold",fontSize:20,
            color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);

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
            
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);
            this.cameras.main.fadeIn(500, 0, 0, 0);
            const par1 = this.add.text(400, 300, "40 Years Later...", 
            {align: "center",fontFamily:"Baskerville",
            fontStyle:"bold",fontSize:100,
            color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);

            const par2 = this.add.text(400, 400, "click to continue", 
            {align: "center",fontFamily:"Baskerville",
            fontStyle:"bold",fontSize:20,
            color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
            
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('gameplay', this.data));
            });
        }
    }
    class End extends Phaser.Scene
    {   
        constructor() {
            super('end')
        }
        
        create ()
        {
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);
            this.w = this.game.config.width;
            this.h = this.game.config.height;
            
            this.label = this.add.text(100, 100, '')
    		.setWordWrapWidth(this.w*14/16)
            .setFontSize(this.w/20)
            .setTint(0xEDC02C)
            .setFontFamily('baskerville');
            

    	    this.typewriteTextWrapped('I wonder.... \nWhat other memories are out there???\n\nThe End\n\n\n\nClick to Continue')


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
            this.add.rectangle(0, 0, 2000, 2000, 0x785741);
            this.w = this.game.config.width;
            this.h = this.game.config.height;

            const text = this.add.text(this.w/2, this.h*1/8, "Credits");
            text.setOrigin(0.5);
            text.setFontSize(this.w/20);
            text.setTint(0xEDC02C)
            text.setFontFamily('baskerville'); 
            //Production Lead: Dexter Zhang\nBackup Tech: Michael Law\nBackup Testing: George Gomez

            const text1 = this.add.text(this.w/12, this.h*1/4, 'Technology Lead');
            text1.setFontSize(this.w/35);
            text1.setTint(0xEDC02C)
            text1.setFontFamily('baskerville'); 

            const text2 = this.add.text(this.w/12, this.h*5/16, 'Testing Lead');
            text2.setFontSize(this.w/35);
            text2.setTint(0xEDC02C)
            text2.setFontFamily('baskerville');  

            const text3 = this.add.text(this.w/12, this.h*6/16, 'Production Lead');
            text3.setFontSize(this.w/35);
            text3.setTint(0xEDC02C)
            text3.setFontFamily('baskerville'); 

            const text4 = this.add.text(this.w/12, this.h*7/16, 'Backup Tech');
            text4.setFontSize(this.w/35);
            text4.setTint(0xEDC02C)
            text4.setFontFamily('baskerville'); 

            // const text5 = this.add.text(this.w/12, this.h*8/16, 'Backup Testing');
            // text5.setFontSize(this.w/35);
            // text5.setTint(0x869d4d);

            
            const text12 = this.add.text(this.w*6.5/10, -50, "Benthan Vu");
            text12.setFontSize(this.w/35);
            text12.setTint(0xEDC02C)
            text12.setFontFamily('baskerville'); 

            const text22 = this.add.text(this.w*6.5/10, this.h + 50, "Kyler Mekmorakoth");
            text22.setFontSize(this.w/35);
            text22.setTint(0xEDC02C)
            text22.setFontFamily('baskerville'); 

            const text32 = this.add.text(-200, this.h*6/16, "Dexter Zhang");
            text32.setFontSize(this.w/35);
            text32.setTint(0xEDC02C)
            text32.setFontFamily('baskerville'); 

            const text42 = this.add.text(this.w*6.5/10, -50, "Michael Law");
            text42.setFontSize(this.w/35);
            text42.setTint(0xEDC02C)
            text42.setFontFamily('baskerville'); 

            const text52 = this.add.text(-200, this.h*8/16, "George Gomez");
            text52.setFontSize(this.w/35);
            text52.setTint(0xEDC02C)
            text52.setFontFamily('baskerville'); 

            const text31 = this.add.text(this.w/2, 800, "QR Code to see Global Player Statistics");
            text31.setFontSize(this.w/35);
            text31.setTint(0xEDC02C).setFontFamily('baskerville').setOrigin(0.5);

            const image32 = this.add.image(this.w/2, 800, 'qrcode').setScale(0.4);

            // add clickable link to https://cmpm-120-final---long-time-statistics.glitch.me/
            const text33 = this.add.text(this.w/2, 800, "Or click here!");
            text33.setFontSize(this.w/35);
            text33.setOrigin(0.5).setFontFamily('baskerville');
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
            gravity: { y: 0 }, // Top down game, so no gravity
            },
        },
        // scene: [Credits, Transition1, Transition2, End, Transition3,  , Cinematic, Gameplay, Inventory, Statistics]
        scene: [Title, Transition1, Transition2, End, Transition3,  Credits, Cinematic, Gameplay, Inventory, Statistics]
    };

    const game = new Phaser.Game(config);
