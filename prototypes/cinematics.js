class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
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

        
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('menu'));
        });
    }
}

class Menu extends Phaser.Scene{
    constructor(){
        super("menu");
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
            console.log("deez");
        })
        text.on("pointerout",()=>{
            text.setColor("#EDC02C");
            console.log("nuts");
        })
    }
    create(){
        this.add.rectangle(0, 0, 2000, 2000, 0xA2EEEB);
        // example objects
        let recPosX = Phaser.Math.Between(100,700);
        let recPosY = Phaser.Math.Between(100,700);
        this.screensaver= this.add.rectangle(recPosX, recPosY, 200, 200, 0x000000);
        this.physics.add.existing(this.screensaver);
        this.screensaver.body.setGravity(0, 0).setBounce(1).setCollideWorldBounds(true).setVelocity(200);
        let circlePosX = Phaser.Math.Between(100,700);
        let circlePosY = Phaser.Math.Between(100,300);
        this.ballin=this.add.circle(circlePosX,circlePosY, 100, 0xffffff);
        this.physics.add.existing(this.ballin);
        this.ballin.body.setCircle(100).setGravity(0, 100).setBounce(1).setCollideWorldBounds(true).setVelocity(-200, -100);
        
        // procedural logo
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
        // const logo = this.add.text(400, 100, "Getting Old", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:100,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const start = this.add.text(400, 250, "Begin living", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();
        const inventory = this.add.text(400, 300, "View your memories", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();
        const credits = this.add.text(400, 350, "Credits", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();

        // this.idleMotionTween(logo, 400, 100);
        this.idleMotionTween(start, 400, 250);
        this.idleMotionTween(inventory, 400, 300);
        this.idleMotionTween(credits, 400, 350);

        this.hoverInteract(start);
        this.hoverInteract(inventory);
        this.hoverInteract(credits);

        start.on("pointerdown", ()=>{
            this.scene.start("transition1");
        });
    }
}
class Transition1 extends Phaser.Scene{
    constructor(){
        super("transition1");
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
            console.log("deez");
        })
        text.on("pointerout",()=>{
            text.setColor("#EDC02C");
            console.log("nuts");
        })
    }
    create(){
        this.counter = 0;
        this.add.rectangle(0, 0, 2000, 2000, 0xA2EEEB);
        const par1 = this.add.text(400, 150, "You've come home from a busy day at school.\nYour parents are proud\nYou've finished your second year of school.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const par2 = this.add.text(400, 300, "Now here you stand at home,\nTwo months of summer break!\nWith a long time to explore limitless possibilities.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const par3 = this.add.text(400, 400, "sample button here", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
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
        this.add.rectangle(675, 500, 50, 100, 0xffffff);
        this.add.text(625, 450, "placeholder for walking sprite animation",{align:"center",color:"#000000",wordWrap:{width:50}});

        // note: it is possible for people to skip the cutscene because of this, might change in the future
        par3.on("pointerdown",()=>{
            this.scene.start('victory');
        })
    }
}

class Victory extends Phaser.Scene{
    constructor() {
        super('victory');
    }
    
    create() {
        // const text = this.add.text(400, 150, 'Congrats you win!', { align: 'center' }, 0xFF69B4);
        const text = this.add.text(400, 150, 'Congrats you win!', { align: 'center' });
        
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
    backgroundColor: '#FFC0CB',
    physics:{default: 'arcade', gravity:1,},
    parent: 'phaser-example',
    scene: [Menu, Transition1, Victory, Intro]
};

const game = new Phaser.Game(config);
