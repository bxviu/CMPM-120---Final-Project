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

        let backBox = this.add.rexRoundRectangle(x, y, displayText.width+30, displayText.height+15, 30, 0xffffaa, 1);
        backBox.setOrigin(0.5);

        this.wholeContainer.add([backBox]);
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
        this.load.path = './assets/images/';
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');
        this.load.image('box', 'box.png');
    }
    init(data) {
        console.log(data.items);
        this.items = data.items;
    }
    create() {
        this.wholeContainer = this.add.container(400, -400);
        // this.addText(0, -175, "Inventory", {font: "100px Arial", fill: "#000000", align: 'center'});
        // let box = this.addClickBox(0, 100, "Back", {font: "50px Arial", fill: "#ff0000", align: 'center'});
        this.currentScene = 'inventory';
        this.nextScene = 'gameplay';
        // this.formatItems();
        // this.animateIn(500, box, "inventory", "intro", {resume: true, animateX: 400, animateY: -400});
        this.makeMenu();
        this.wholeContainer.setDepth(10);
        this.tweens.add({
            targets: [this.gridTable,this.wholeContainer,],
            y: 300,
            duration: 500,
            ease: 'Cubic.out',

        });
    }

    makeMenu() {
        let backBox = this.make.nineslice({
            x: -150,
            y: 0,
            key: 'box',

            width: 450,
            height: 350,
            leftWidth: 5,
            rightWidth: 5,
            topHeight: 5,
            bottomHeight: 5,
        
            origin: {x: 0.5, y: 0.5},
        
            add: true
        });//this.add.rexRoundRectangle(-150,0,350,450,10,COLOR_LIGHT,1);//250, 300, 350, 450, 10, COLOR_LIGHT, 1);
        backBox.setOrigin(0.5).setDepth(10).setRotation(Math.PI/2).setTint(0xd1a192);
        let descriptionBox = this.make.nineslice({
            x: -150,
            y: 130,
            key: 'box',

            width: 320,
            height: 160,
            leftWidth: 5,
            rightWidth: 5,
            topHeight: 5,
            bottomHeight: 5,
        
            origin: {x: 0.5, y: 0.5},
        
            add: true
        });//this.add.rexRoundRectangle(-150,130,320,160,10,COLOR_PRIMARY,1);//250, 430, 320, 160, 10, COLOR_PRIMARY, 1);
        descriptionBox.setOrigin(0.5).setDepth(11);
        let descriptionText = this.add.text(-150,130,"", {wordWrap: { width: 320, useAdvancedWrap: true}}).setOrigin(0.5).setDepth(12);//250, 430, '').setDepth(12).setOrigin(0.5);
        let fullName = this.add.text(-150,80,"", {wordWrap: { width: 320, useAdvancedWrap: true}, font: "20px Arial", fill: "#000000", align: 'center'}).setOrigin(0.5).setDepth(12);//250, 430, '').setDepth(12).setOrigin(0.5);
        let itemImage = this.add.image(-150, -80, "item1").setScale(0.5).setDepth(12).setOrigin(0.5).setAlpha(0);
        // this.wholeContainer.add([backBox, descriptionBox, descriptionText]);
        let slice = this.make.nineslice({
            x: 0,
            y: 0,
            key: 'box',

            width: 50,
            height: 56,
            leftWidth: 5,
            rightWidth: 5,
            topHeight: 5,
            bottomHeight: 5,
        
            origin: {x: 0.5, y: 0.5},
        
            add: true
        })
        slice.setTint(0x785741);

        var scrollMode = 0; // 0:vertical, 1:horizontal
        this.gridTable = this.rexUI.add.gridTable({
            x: 400,
            y: -400,
            width: (scrollMode === 0) ? 700 : 420,
            height: (scrollMode === 0) ? 500 : 300,

            scrollMode: scrollMode,

            background: slice,//this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

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
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            header: this.rexUI.add.label({
                width: (scrollMode === 0) ? undefined : 30,
                height: (scrollMode === 0) ? 30 : undefined,

                orientation: scrollMode,
                background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
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
                        icon: scene.add.image(0, 0, item.imageKey),//scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: (scrollMode === 0) ? 20 : 0,
                            top: (scrollMode === 0) ? 0 : 15,
                        }
                    });
                    // console.log(cell.index + ': create new cell-container');
                } else {
                    // console.log(cell.index + ': reuse cell-container');
                }

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('text').setText(item.displayName); // Set text of text object
                cellContainer.getElement('icon').setScale(0.1)
                //.setFillStyle(item.color); // Set fill color of round rectangle object
                cellContainer.getElement('background').setStrokeStyle(2, COLOR_DARK).setDepth(0);
                return cellContainer;
            },
            items: this.items//this.createItems(10)
        })
            .layout()
        // .drawBounds(this.add.graphics(), 0xff0000);

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
                // if (itemImage) {
                //     itemImage.destroy();
                // }
                // descriptionText.setText("");
                // fullName.setText("");
            }, this)
            .on('cell.click', function (cellContainer, cellIndex, pointer) {
                // if (itemImage) {
                //     // itemImage.destroy();
                // }
                let imageKey = this.gridTable.items[cellIndex].imageKey;
                // itemImage = this.add.image(250, 210, imageKey).setScale(0.5).setDepth(12).setOrigin(0.5);
                console.log(itemImage);
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
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
            text: scene.add.text(0, 0, text),
            icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
            align: 'center',
            space: {           
                icon: 10
            }
        })
            .setInteractive()
            .on('pointerdown', function () {
                console.log(`Pointer down ${text}`)
                scene.menuLeave([scene.wholeContainer,scene.gridTable], scene.currentScene, scene.nextScene, {resume:true, animateX:400, animateY:-400});   
                // console.log(scene);
                // scene.scene.resume(scene.nextScene);
                // scene.scene.stop(scene.currentScene);                

            })
            .on('pointerover', function(){
                this.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('pointerout', function(){
                this.getElement('background').setStrokeStyle();
            })  
    }

    createItems(count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({
                id: i,
                color: Random(0, 0xffffff)
            });
        }
        return data;
    }
    

    formatItems() {

        let imageX = -200;
        let imageY = -80;
        let id = 0;
        console.log(this.items);
        console.log(this.createItems(2));
        this.items.forEach(item => {
            let image = null;
            item.id = id;
            id++;
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

class Statistics extends Menu {
    constructor() {
        super("statistics");
    }
    init(data) {
        this.data = data || {
            steps: 0,
            totalItems: 0,
            item1: 0,
            item2: 0,
            item3: 0,
        };
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        let config = {
            font: "10px Arial",
            fill: "#000000",
            wordWrap: { width: 450, useAdvancedWrap: true},
            align: 'center'
        };
        this.addText(0,-100,"Steps: " + this.data.stats.steps,config)
        this.addText(0,-80,"Total Items: " + this.data.stats.steps,config)
        let yVal = -60
        for (let key in this.data.stats) {
            if (key == "steps" || key == "totalItems") {
                continue;
            }
            this.addText(0,yVal,key + ": " + this.data.stats[key], config)
            yVal += 20;
        }

        if (this.data.level == 3) {
            this.uploadStatistics(this.data.stats);
        }
        // let box = this.addClickBox(0,0, "next")
        this.animateIn(1000, null, "statistics", "cinematic", this.data)
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('cinematic', this.data));
        });
    }

    uploadStatistics(stats) {
        // this.add.text(360,300,"click to send\ndata to server").setDepth(15).setScrollFactor(0).setInteractive().on('pointerdown', () => {
        //     // connect to server and send statistics
        //     fetch('https://enchanting-third-swing.glitch.me/', {
        //         method: 'POST',
        //         headers: {
        //         },
        //         mode: 'no-cors',
        //         body: JSON.stringify({
        //             steps: 1,
        //             totalItems: 3,
        //             item1: 1,
        //             item2: 1,
        //             item3: 1,
        //         })
        //     })
        // });
        fetch('https://enchanting-third-swing.glitch.me/', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(stats)
        })
    }
}