class Menu extends Phaser.Scene {
    init(data) {
    }
    preload ()
    {       
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.plugin('rexkawaseblurpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexkawaseblurpipelineplugin.min.js', true);
        this.load.plugin('rexdropshadowpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdropshadowpipelineplugin.min.js', true);
        this.load.path = './assets/images/';
        this.load.image('box', 'box.png');
        this.load.image('boxBig', 'box-big.png');
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');        
        this.load.image('inventoryButton', 'inventoryButton.png');
        this.load.image('xButton', 'xButton.png');
    }   
    create() {
        this.wholeContainer = this.add.container(400, -1000);

        let entireBox = this.addBackgroundBox(0,0,750,550,true);
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

    addBackgroundBox(x,y,width,height,big,color,addToContainer) {
        let slice = this.make.nineslice({
            x: x,
            y: y,
            key: big ? 'boxBig' : 'box',

            width: width,
            height: height,
            leftWidth: big ? 13 : 5,
            rightWidth: big ? 13 : 5,
            topHeight: big ? 13 : 5,
            bottomHeight: big ? 13 : 5,
        
            origin: {x: 0.5, y: 0.5},
        
            add: true
        }).setTint(color || 0xffffff);
        if (addToContainer) {
            this.wholeContainer.add([slice]);
        }
        return slice;
    }

    addImage(x,y,key,config) {
        if (config == undefined) {
            config = {
                scale: 0.125
            };
        }
        let displayImage = this.add.image(x, y, key);
        displayImage.setOrigin(0.5).setScale(config.scale);
        this.wholeContainer.add([displayImage]);

        return displayImage;
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
            targets: [...target],
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
const Random = Phaser.Math.Between;
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
class Inventory extends Menu {
    constructor() {
        super("inventory");
    }
    preload() {
        super.preload();
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        // this.load.path = './assets/images/';
        // this.load.image('item1', 'placeholder7-bow.png');
        // this.load.image('item2', 'placeholder6-arrow.png');
        // this.load.image('box', 'box.png');
    }
    init(data) {
        console.log(data.items);
        this.items = data.items;
        this.nextScene = data.nextScene;
    }
    create() {
        this.wholeContainer = this.add.container(400, -400);
        // super.create()
        // this.addText(0, -175, "Inventory", {font: "100px Arial", fill: "#000000", align: 'center'});
        // let box = this.addClickBox(0, 100, "Back", {font: "50px Arial", fill: "#ff0000", align: 'center'});
        this.currentScene = 'inventory';
        // this.nextScene = 'gameplay';
        // this.animateIn(500, box, "inventory", "intro", {resume: true, animateX: 400, animateY: -400});
        this.makeMenu();
        this.wholeContainer.setDepth(10);
        this.scene.bringToTop('inventory');
        this.tweens.add({
            targets: [this.gridTable,this.wholeContainer,],
            y: 300,
            duration: 500,
            ease: 'Cubic.out',

        });
    }

    makeMenu() {
        let backBox = this.addBackgroundBox(-150,0,450,350,false,0xd1a192,false).setDepth(10).setRotation(Math.PI/2);
        let descriptionBox = this.addBackgroundBox(-150,130,320,160,false,null,false).setDepth(11);
        let descriptionText = this.add.text(-150,140,"Click an item to view your memories about it", {wordWrap: { width: 300, useAdvancedWrap: true}}).setOrigin(0.5).setDepth(12);//250, 430, '').setDepth(12).setOrigin(0.5);
        let fullName = this.add.text(-150,80,"", {wordWrap: { width: 320, useAdvancedWrap: true}, font: "20px Arial", fill: "#000000", align: 'center'}).setOrigin(0.5).setDepth(12);//250, 430, '').setDepth(12).setOrigin(0.5);
        let itemImage = this.add.image(-150, -80, "item1").setScale(0.5).setDepth(12).setOrigin(0.5).setAlpha(0);

        var scrollMode = 0; // 0:vertical, 1:horizontal
        this.gridTable = this.rexUI.add.gridTable({
            x: 400,
            y: -400,
            width: (scrollMode === 0) ? 700 : 420,
            height: (scrollMode === 0) ? 500 : 300,

            scrollMode: scrollMode,

            background: this.addBackgroundBox(0,0,50,50,true,0x785741,false),

            table: {
                cellWidth: (scrollMode === 0) ? undefined : 120,
                cellHeight: (scrollMode === 0) ? 60 : undefined,

                columns: 1,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: true,
            },

            slider: {
                track: this.addBackgroundBox(0,0,20,10,false,0x785741,false),
                thumb: this.addBackgroundBox(0,0,15,30,false,null,false),
            },
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            header: this.rexUI.add.label({
                width: (scrollMode === 0) ? undefined : 30,
                height: (scrollMode === 0) ? 30 : undefined,

                orientation: scrollMode,
                background: this.addBackgroundBox(0,0,20,20,false,0xc9ba8b,false),
                text: this.add.text(0, 0, 'Inventory').setOrigin(0.5),
                align: 'center',
            }),

            footer: this.getFooterSizer(this, scrollMode),

            space: {
                left: 400,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,

                        orientation: scrollMode,
                        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                        icon: scene.add.image(0, 0, item.imageKey),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: (scrollMode === 0) ? 20 : 0,
                            top: (scrollMode === 0) ? 0 : 15,
                        }
                    });
                } 

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('text').setText(item.displayName); // Set text of text object
                cellContainer.getElement('icon').setScale(0.1)
                cellContainer.getElement('background').setStrokeStyle(2, COLOR_DARK).setDepth(0);
                return cellContainer;
            },
            items: this.items
        })
            .layout()

        this.gridTable
            .on('cell.over', function (cellContainer, cellIndex, pointer) {
                cellContainer.getElement('background')
                    .setStrokeStyle(2, COLOR_LIGHT)
                    .setDepth(1);
               
            }, this)
            .on('cell.out', function (cellContainer, cellIndex, pointer) {
                cellContainer.getElement('background')
                    .setStrokeStyle(2, COLOR_DARK)
                    .setDepth(0);
            }, this)
            .on('cell.click', function (cellContainer, cellIndex, pointer) {
                let imageKey = this.gridTable.items[cellIndex].imageKey;
                itemImage.setTexture(imageKey).setAlpha(1);

                descriptionText.setText(this.gridTable.items[cellIndex].description);
                fullName.setText(this.gridTable.items[cellIndex].fullName);

                var nextCellIndex = cellIndex + 1;
                var nextItem = this.gridTable.items[nextCellIndex];
                if (!nextItem) {
                    return;
                }
                nextItem.color = 0xffffff - nextItem.color;
                this.gridTable.updateVisibleCell(nextCellIndex);
            }, this)

        this.wholeContainer.add([backBox, descriptionBox, descriptionText, fullName, itemImage]);
    }

    getFooterSizer(scene, orientation) {
        return scene.rexUI.add.sizer({
            orientation: orientation
        })
            .add(
                this.createFooterButton(scene, 'Exit', orientation),    // child
                1,         // proportion
                'center'   // align
            )
    }
    
    createFooterButton(scene, text, orientation) {
        return scene.rexUI.add.label({
            height: (orientation === 0) ? 40 : undefined,
            width: (orientation === 0) ? undefined : 40,
            orientation: orientation,
            background: this.addBackgroundBox(0,0,2,2,false,0xc9ba8b,false), //scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
            text: scene.add.text(0, 0, text),
            icon: scene.add.image(0, 0, 'xButton').setScale(0.3),//scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
            align: 'center',
            space: {           
                icon: 10
            }
        })
            .setInteractive()
            .on('pointerdown', function () {
                scene.tweens.add({
                    targets: this.getElement('background'),
                    scaleX: 0.9,
                    scaleY: 0.9,
                    duration: 200,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: 0,
                    onComplete: () => {
                        scene.menuLeave([scene.wholeContainer,scene.gridTable], scene.currentScene, scene.nextScene, {resume:true, animateX:400, animateY:-400});
                    }
                });      
            })
            .on('pointerover', function(){
                this.getElement('background').setTint(0xffffff)
            })
            .on('pointerout', function(){
                this.getElement('background').setTint(0xc9ba8b)
            })  
    }
}

class Statistics extends Menu {
    constructor() {
        super("statistics");
    }
    init(data) {
        this.data = Object.keys(data).length != 0 ? data : {
            level: -1,
            stats:{
                steps: 0,
                totalItems: 0,
                ball: 0,
                bucketAndShovel: 0,
                leaves: 0,
                book: 0,
                tree: 0,
                swingset: 0,
                boat: 0,
                flag: 0,
                cap: 0,
                dog: 0,
            }
        };
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        console.log(this.data);
        let configTitle = {
            font: "40px Arial",
            fill: "#000000",
            wordWrap: { width: 450, useAdvancedWrap: true},
            align: 'center'
        };
        let configBig = {
            font: "30px Arial",
            fill: "#000000",
            wordWrap: { width: 450, useAdvancedWrap: true},
            align: 'center'
        };
        let configSmall = {
            font: "20px Arial",
            fill: "#000000",
            wordWrap: { width: 450, useAdvancedWrap: true},
            align: 'center'
        };
        this.addBackgroundBox(0,-210,600,75, false, null, true);
        this.addText(0,-210,"Long Time - Statistics: " + (this.data.level - 1),configTitle);
        this.addBackgroundBox(-150,-140,275,50, false, null, true );
        this.addText(-150,-140,"Steps: " + this.data.stats.steps,configBig)
        this.addBackgroundBox(150,-140,275,50, false, null, true );
        this.data.stats.totalItems = 0;
        for (let key in this.data.stats) {
            if (key == "steps" || key == "totalItems") {
                continue;
            }
            this.data.stats.totalItems += this.data.stats[key];
        }
        this.addText(135,-140,"Total Items: " + this.data.stats.totalItems,configBig)

        let yVal = -65;
        let xVal = -180;
        let yDelta = 70;
        let imageOffset = -140;
        let count = 0;
        for (let key in this.data.stats) {
            if (key == "steps" || key == "totalItems") {
                continue;
            }
            this.addBackgroundBox(xVal,yVal,350,75, false, null, true );
            if (key == "ball") {
                this.addImage(xVal+imageOffset,yVal, "item1", )
                this.addText(xVal,yVal,"Ball Found: " + this.data.stats.ball,configSmall)
            }
            else if (key == "bucketAndShovel") {
                this.addImage(xVal+imageOffset,yVal, "item2", )
                this.addText(xVal+20,yVal,"Bucket and Shovel Found: " + this.data.stats.bucketAndShovel,configSmall)
            }
            else if (key == "leaves") {
                this.addImage(xVal+imageOffset,yVal, "item3", )
                this.addText(xVal,yVal,"Leaves Found: " + this.data.stats.leaves,configSmall)
            }
            else if (key == "book") {
                this.addImage(xVal+imageOffset,yVal, "item4", )
                this.addText(xVal,yVal,"Book Found: " + this.data.stats.book,configSmall)
            }
            else if (key == "tree") {
                this.addImage(xVal+imageOffset,yVal, "item5", )
                this.addText(xVal,yVal,"Tree Found: " + this.data.stats.tree,configSmall)
            }
            else if (key == "swingset") {
                this.addImage(xVal+imageOffset,yVal, "item6", )
                this.addText(xVal,yVal,"Swingset Found: " + this.data.stats.swingset,configSmall)
            }
            else if (key == "boat") {
                this.addImage(xVal+imageOffset,yVal, "item7", )
                this.addText(xVal,yVal,"Boat Found: " + this.data.stats.boat,configSmall)
            }
            else if (key == "flag") {
                this.addImage(xVal+imageOffset,yVal, "item8", )
                this.addText(xVal,yVal,"Flag Found: " + this.data.stats.flag,configSmall)
            }
            else if (key == "cap") {
                this.addImage(xVal+imageOffset,yVal, "item9", )
                this.addText(xVal,yVal,"Baseball Cap Found: " + this.data.stats.cap,configSmall)
            }
            else if (key == "dog") {
                this.addImage(xVal+imageOffset,yVal, "item10", )
                this.addText(xVal,yVal,"Dog Found: " + this.data.stats.dog,configSmall)
            }
            if (count > 3) {
                yVal = -65;
                xVal = 180;
                count = 0;
            }
            else {
                count++;
                yVal += yDelta;
            }
        }

        if (xVal == -180 && yVal == -65) {
            this.addBackgroundBox(0,75,350,75, false, null, true );
            this.addText(0,75,"No Items Found",configSmall)
        }

        if (this.data.level == 4) {
            this.uploadStatistics(this.data.stats);
        }


        this.makeButtons();

        this.animateIn(1000, null, "statistics", "cinematic", this.data)
    }

    makeButtons() {
        let plinkNoise = this.sound.add('plink', { loop: false });
        this.inventoryButton = this.add.image(-360, -260, "inventoryButton").setScrollFactor(0).setScale(1).setOrigin(0.5).setAlpha(0.5).setDepth(20);
        this.inventoryButton.setInteractive({useHandCursor: true});
        this.inventoryButton.on('pointerdown', () => {
            this.tweens.add({
                targets: this.inventoryButton,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
                repeat: 0
                });
            plinkNoise.play();
            this.time.delayedCall(300, () => {
                this.scene.pause('statistics');
                this.scene.launch('inventory', {items:this.data.items, nextScene: 'statistics'});
            });
        })
        .on('pointerover', () => {
            this.inventoryButton.setAlpha(1);
        })
        .on('pointerout', () => {
            this.inventoryButton.setAlpha(0.5);
        });

        this.xButton = this.add.image(360, -260, "xButton").setScrollFactor(0).setScale(1).setOrigin(0.5).setAlpha(0.5).setDepth(20);
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
            plinkNoise.play();
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('cinematic', this.data));
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

        this.wholeContainer.add([this.inventoryButton, this.xButton]);
    }
    

    uploadStatistics(stats) {
        fetch('https://cmpm-120-final---long-time-statistics.glitch.me/', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(stats)
        })
    }
}