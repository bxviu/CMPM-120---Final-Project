class Menu extends Phaser.Scene {
    init(data) {
    }
    preload ()
    {       
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.plugin('rexkawaseblurpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexkawaseblurpipelineplugin.min.js', true);
        this.load.plugin('rexdropshadowpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdropshadowpipelineplugin.min.js', true);
    }   
    create(color) {
        if (color == undefined) {
            color = 0x99b0af;
        }
        this.wholeContainer = this.add.container(400, -1000);
        let entireBox = this.add.rexRoundRectangle(0, 0, 700, 500, 30, color, 1);
        this.wholeContainer.add([entireBox]);
    }
    
    update() {
    }

    addClickBox(x,y,text,config) {
        if (config == undefined) {
            config = {
                font: "50px Arial",
                fill: "#ff0000",
                wordWrap: { width: 450, useAdvancedWrap: true},
                align: 'center'
            };
        }
        // clickable button to start the game
        let clickText = this.add.text(x, y, text, config).setOrigin(0.5);

        let clickBox = this.add.rexRoundRectangle(x, y, 150, 100, 30, 0xffffaa, 1);
        // startBox.postFX.addShadow(-1,1,0.02,1,0x000000,12,1);
        clickBox.setInteractive({useHandCursor: true});

        this.wholeContainer.add([clickBox]);
        this.wholeContainer.add([clickText]);

        return clickBox;
    }

    addText(x,y,text,config) {
        if (config == undefined) {
            config = {
                font: "100px Arial",
                fill: "#000000",
                wordWrap: { width: 450, useAdvancedWrap: true},
                align: 'center'
            };
        }
        let displayText = this.add.text(x, y, text, config);
        displayText.setOrigin(0.5);
        this.wholeContainer.add([displayText]);

        return displayText;
    }

    animateIn(time, clickBox, currentScene, nextScene, config) {
        this.tweens.add({
            targets: this.wholeContainer,
            y: 300,
            duration: time,
            ease: 'Cubic.out',
            onComplete: () => {
                if (clickBox) {
                    clickBox.on('pointerdown', () => { 
                        this.menuLeave(this.wholeContainer, currentScene, nextScene, config);    
                    });
                }
            }
        });
    }

    menuLeave(target, originalScene, nextScene, config) {
        // animate the menu leaving
        if (config.animateX == undefined) {
            config.animateX = 3000;
        }
        if (config.animateY == undefined) {
            config.animateY = 0;
        }
        this.tweens.add({
            targets: target,
            x: config.animateX,
            y: config.animateY,
            duration: 500,
            ease: 'Cubic.in',
            onComplete: () => {
                this.time.delayedCall(250, ()=>{
                    this.closeMenu(originalScene, nextScene, config);       
                });
            }   
        });
    }

    closeMenu(originalScene,nextScene,config) {
        if (config == undefined) {
            config = {resume: false};
        }
        if (config.resume == true) {
            this.scene.resume(nextScene);
        }
        else {
            this.scene.start(nextScene, config);
        }
        if (nextScene != originalScene) {
            this.scene.stop(originalScene);
        }
    }
}

class Inventory extends Menu {
    constructor() {
        super("inventory");
    }
    preload() {
        super.preload();
        this.load.path = './assets/images/';
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');
    }
    init(data) {
        console.log(data.items);
        this.items = data.items;
    }
    create() {
        super.create();
        this.addText(0, -200, "Inventory", {font: "100px Arial", fill: "#000000", align: 'center'});
        let box = this.addClickBox(0, 100, "Back", {font: "50px Arial", fill: "#ff0000", align: 'center'});
        this.formatItems();
        this.animateIn(500, box, "inventory", "intro", {resume: true, animateX: 400, animateY: -400});
    }

    formatItems() {
        let imageX = -200;
        let imageY = -80;
        // console.log(this.items);
        this.items.forEach(item => {
            let image = null;
            // if (item.name == "bow") {
                console.log(item.displayName);
                image = this.add.image(imageX, imageY, item.imageKey).setOrigin(0.5);
            // }
            if (image) {
                image.setScale(0.25);
                image.setDepth(1);
                imageX += 100;
                this.wholeContainer.add([image]);
            }
        });    

    }

}