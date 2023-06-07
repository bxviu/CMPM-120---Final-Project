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
            this.time.delayedCall(1000, () => this.scene.start('Menu'));
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
            {x: x+Phaser.Math.Between(0,4),y:y+Phaser.Math.Between(-4,4),ease:"sine.inout",duration:3000, delay:Phaser.Math.Between(0,1000)},
            {x: x-Phaser.Math.Between(0,4),y:y+Phaser.Math.Between(-4,4),ease:"sine.inout",duration:3000, delay:Phaser.Math.Between(0,1000)},
        ]});
    }

    create(){
        const background = this.add.rectangle(0, 0, 2000, 2000, 0xA2EEEB);
        const logo = this.add.text(400, 100, "Getting Old", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:100,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const start = this.add.text(400, 250, "Begin living", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5).setInteractive();
        const inventory = this.add.text(400, 300, "View your memories", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const credits = this.add.text(400, 350, "Credits", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        console.log(Phaser.Math.Between(0, 1000));
        this.idleMotionTween(logo, 400, 100);
        this.idleMotionTween(start, 400, 250);
        this.idleMotionTween(inventory, 400, 300);
        this.idleMotionTween(credits, 400, 350);
        start.on("pointerdown", ()=>{
            this.scene.start("transition1");
        });
    }
}
class Transition1 extends Phaser.Scene{
    constructor(){
        super("transition1");
    }
    create(){
        const background = this.add.rectangle(0, 0, 2000, 2000, 0xA2EEEB);
        const par1 = this.add.text(400, 150, "You've come home from a busy day at school.\nYour parents are proud\nYou've finished your second year of school.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const par2 = this.add.text(400, 300, "Now here you stand at home,\nTwo months of summer break!\nWith a long time to explore limitless possibilities.", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
        const par3 = this.add.text(400, 400, "sample button here", {align: "center",fontFamily:"Baskerville",fontStyle:"bold",fontSize:30,color:"#EDC02C",resolution:window.devicePixelRatio,}).setOrigin(0.5,0.5);
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
    parent: 'phaser-example',
    // scene: [Intro, Menu, Victory]
    scene: [Menu, Transition1, Victory]
};

const game = new Phaser.Game(config);
