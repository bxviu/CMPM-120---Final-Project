class Gameplay extends Phaser.Scene
{   
    constructor() {
        super('gameplay')
    }

    init(data) {
        this.timeLimit = data.limit || 16;
        this.stats = data.stats || {
            steps: 0,
            totalItems: 0,
        };
        this.playerItems = data.items || [];
        this.level = data.level || 1;
    }

    preload() {
        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        
        this.load.path = './data/';
        this.load.tilemapTiledJSON("map", "Getting_Old_Tilemap_large_v1.1.1.json");

        this.load.path = './assets/tilemap/';
        this.load.image("tiles", "First Asset pack.png");

        this.load.path = './assets/images/';
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');
        this.load.image('movementArrow', 'movementArrow.png');
        this.load.image('joystickBase', 'joystickBase.png');
        this.load.image('interactButton', 'interactButton.png');
        this.load.image('inventoryButton', 'inventoryButton.png');
        this.load.image('settingsButton', 'settingsButton.png');
        this.load.image('box', 'box.png');
        
        this.load.path = './assets/images/character/';
        this.load.spritesheet('playerRight', 'ACharRight.png', { frameWidth: 13, frameHeight: 18 });
        this.load.spritesheet('playerUp', 'ACharUp.png', { frameWidth: 14, frameHeight: 19 });
        this.load.spritesheet('playerDown', 'ACharDown.png', { frameWidth: 14, frameHeight: 19 });

        this.load.path = './assets/sounds/';
        this.load.audio('bgMusic', "miamiSong.wav");
        this.load.audio('plink', "plink.mp3")

    }
    
    create ()
    {   
        this.items = [];
        this.muteMusic = (localStorage.getItem("bgMute") == "true" ? true : false);;

        fetch("./data/itemInfo.json").then(
            (response) => response.json()
        ).then(
            (json) => {
                this.createItems(json);
            }
        );
        
        this.bgMusic = this.sound.add('bgMusic', { loop: true });
        if (!this.muteMusic) {
            this.bgMusic.play();
        }
        console.log(this)

        this.sceneDuration = 0;
        this.timer = false;

        this.totaltime = this.timeLimit;

        this.moving = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        this.player = (new Player(this, 0, 145, 'InputName', {speed:50+(25*(3 - this.level)), items:this.playerItems}));
        console.log(this.player.speed)

        this.cameras.main.fadeIn(500, 0, 0, 0)
        this.player.setAlpha(0);
        this.player.play("sideways");
        this.tweens.add({
            targets: this.player,
            x: 40,
            alpha:1,
            duration: 1000,
            onComplete: () => {
                this.player.stopAnim();
                // if (this.level == 1) {
                //     this.playTutorial();
                // }
                // else {
                //     this.timer = true;
                // }
            }
        })

        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("rpgtileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        // console.log( tileset.getTileLayerNames());
        const ground = map.createLayer("Ground", tileset, 0, 0);
        const cliffs = map.createLayer("Cliffs", tileset, 0, 0);
        const cliffs2 = map.createLayer("Cliffs 2", tileset, 0, 0);
        const plants1 = map.createLayer("Plants", tileset, 0, 0);
        const plants2 = map.createLayer("Plants 2", tileset, 0, 0).setDepth(3);
        const plants3 = map.createLayer("Plants 3", tileset, 0, 0);
        const plants4 = map.createLayer("Plants 4", tileset, 0, 0).setDepth(3);
        const fences = map.createLayer("Fences", tileset, 0, 0).setDepth(3);
        const buildings = map.createLayer("Buildings", tileset, 0, 0);
        const collision = map.createLayer("Collision", tileset, 0, 0);

        collision.setCollisionBetween(1, 999, true, 'Collision');

        collision.forEachTile(function(tile, index, tileArray) {
            tile.setAlpha(0);
        });

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // collision.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        //     });
            
        this.physics.add.collider(this.player, collision);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.makeUI();
        this.initializeCamera(map);
        this.addMapDragging();
    }
    
    update(time, delta) {
        this.updateTimer(delta);
        
        // Stop any previous movement from the last frame
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        this.checkControls();
        this.movePlayer();

        if (this.camFocusPlayer) {
            this.camGoToPlayer(delta);
        }
        
    }

    createItems(itemInfo) {
        for (const key in itemInfo){
            // console.log(`${key} : ${itemInfo[key]["displayName"]}`)
            let currentItem = itemInfo[key];
            this.items.push(new Item(this, currentItem["coordinates"]["x"], currentItem["coordinates"]["y"], key, currentItem["imageKey"], {
                    displayName:currentItem["displayName"], 
                    fullName:currentItem["fullName"], 
                    description:currentItem["description"],
                    scale:0.05,
                }));
        }
    }

    initializeCamera(map) {
        this.camFocusX = this.player.x;
        this.camFocusY = this.player.y;
        this.camFocusPlayer = false;

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.setLerp(0.1, 0.1);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    makeUI() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/
        this.timerDisplay = this.add.text(400, 210, "Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s", {font: "15px Arial", fill: "#000000"});
        this.timerDisplay.setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(20);

        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 315,
            y: 350,
            radius: 40,
            base: this.add.image(0, 0, "joystickBase").setScale(1.2).setOrigin(0.5).setAlpha(0.5).setDepth(20),
            thumb: this.add.image(0, 0, "joystickBase").setScale(0.35).setOrigin(0.5).setAlpha(0.5).setRotation(-Math.PI/4).setDepth(21),
            dir: '8dir',
        }); 
        this.onButton = false;
        this.joyStick.on('pointerdown', (pointer) => {this.onButton = true;});
        this.joyStick.on('pointerup', (pointer) => {this.onButton = false;});

        this.inventoryButton = this.add.image(295, 228, "inventoryButton").setScrollFactor(0).setScale(0.75).setOrigin(0.5).setAlpha(0.5).setDepth(20);
        this.interactButton = this.add.image(505, 365, "interactButton").setScrollFactor(0).setScale(0.75).setOrigin(0.5).setAlpha(0.5).setDepth(20);
        //settings in top right corner
        this.makeSettingsMenu();

        let plinkNoise = this.sound.add('plink', { loop: false });

        this.inventoryButton.setInteractive({useHandCursor: true});
        this.inventoryButton.on('pointerdown', () => {
            this.tweens.add({
                targets: this.inventoryButton,
                scaleX: 0.65,
                scaleY: 0.65,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
                repeat: 0
                });
            plinkNoise.play();
            this.time.delayedCall(300, () => {
                this.scene.pause('gameplay');
                this.scene.launch('inventory', {items:this.player.items, nextScene: 'gameplay'});
            });
        })
        .on('pointerover', () => {
            this.inventoryButton.setAlpha(1);
        })
        .on('pointerout', () => {
            this.inventoryButton.setAlpha(0.5);
        });

        this.interactButton.setInteractive({useHandCursor: true});
        this.interactButton.on('pointerdown', () => {
            // make button bigger and shrink down over 2 seconds 
            this.tweens.add({
                targets: this.interactButton,
                scaleX: 0.65,
                scaleY: 0.65,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
                repeat: 0
                });
            this.items.forEach(item => {
                if (!this.player.checkItem(item, this.player.interacted)) {
                    this.physics.overlap(this.player.body, item.body, (player, itemBody) =>
                    {   
                        if (!this.stats[item.name]) {
                            this.stats[item.name] = 1;
                        }
                        else {
                            this.stats[item.name] += 1;
                        }
                        this.stats.totalItems += 1;
                        plinkNoise.play();
                        if (!this.player.checkItem(item, this.player.items)) {
                            this.player.gainItem({
                                name:item.name, 
                                fullName:item.fullName,
                                displayName:item.displayName,
                                imageKey:item.imageKey,
                                description:item.description
                            });
                        }
                    });
                }
            });
        })        
        .on('pointerover', () => {
            this.interactButton.setAlpha(1);
        })
        .on('pointerout', () => {
            this.interactButton.setAlpha(0.5);
        });
    }

    makeSettingsMenu() {
        this.settingsMenu = this.add.container(560, 230).setScrollFactor(0).setDepth(20);

        let fullscreenButton = this.add.text(0, 0, "Fullscreen", {font: "10px Arial", fill: 0xFFFFFF, align: "center"}).setScrollFactor(0).setScale(0.75).setOrigin(0.5);
        fullscreenButton.setScrollFactor(0).setScale(0.75).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.onButton = true;
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
                fullscreenButton.setText("Fullscreen");
            }
            else {
                this.scale.startFullscreen();
                fullscreenButton.setText("Exit\nFullscreen");
            }
            // fullscreenButton.setText(this.scale.isFullscreen ? "Exit Fullscreen" : "Fullscreen")
            // need this to be delayed a bit or else the map will be dragged when you press the button
            this.time.delayedCall(1, () => {
                this.onButton = false;
            });
        });

        let muteButton = this.add.text(0, -15, "Mute", {font: "10px Arial", fill: 0xFFFFFF}).setScrollFactor(0).setScale(0.75).setOrigin(0.5);
        muteButton.setText(this.muteMusic ? "Unmute" : "Mute");

        muteButton.setInteractive({useHandCursor: true});
        muteButton.on('pointerdown', () => {
            this.muteMusic = !this.muteMusic;
            localStorage.setItem("bgMute", this.muteMusic);
            if (this.muteMusic) {
                muteButton.setText("Unmute");
                this.bgMusic.stop();
            }
            else {
                muteButton.setText("Mute");
                this.bgMusic.play();
            }
        });

        this.settingsMenuShowing = false;
        let settingsButton = this.add.image(-40,-15, "settingsButton").setScrollFactor(0).setScale(0.25).setOrigin(0.5).setAlpha(0.75);
        settingsButton.setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            // move menu to the top right corner
            if (!this.settingsMenuShowing) {
                this.tweens.add({
                    targets: this.settingsMenu,
                    x: 505,
                    duration: 150,
                    ease: 'Power2',
                    })
            }
            else {
                this.tweens.add({
                    targets: this.settingsMenu,
                    x: 560,
                    duration: 150,
                    ease: 'Power2',
                    })
            }
            this.settingsMenuShowing = !this.settingsMenuShowing;
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: settingsButton,
                angle: -180,
                duration: 200,
                ease: 'Power2',
                alpha: 1
            });
        })
        .on('pointerout', () => {
            this.tweens.add({
                targets: settingsButton,
                angle: 0,
                duration: 200,
                ease: 'Power2',
                alpha: 0.75
            });
        })

        let background = this.make.nineslice({
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
        });

        this.settingsMenu.add(background);
        this.settingsMenu.add([fullscreenButton,muteButton,settingsButton])
    }

    addMapDragging() {
        // allows player to click and drag to see the area around the player
        this.initialPointerPosition = null;
        this.input.on('pointerdown', function(pointer) {
            console.log(this.onButton)
            if (!this.onButton) {
                this.joyStick.setEnable(false);
                this.camFocusPlayer = false;
                this.timer = false;
                // Store the initial pointer position
                this.initialPointerPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
                this.cameras.main.stopFollow();
                console.log(this.initialPointerPosition);
            }
        }, this);
    
        this.input.on('pointermove', function(pointer) {
            if (this.initialPointerPosition) {
                // Calculate the distance moved by the pointer
                var deltaX = pointer.x - this.initialPointerPosition.x;
                var deltaY = pointer.y - this.initialPointerPosition.y;
    
                // Move the camera accordingly
                this.cameras.main.scrollX -= deltaX;
                this.cameras.main.scrollY -= deltaY;
                this.camFocusX = this.cameras.main.midPoint.x;
                this.camFocusY = this.cameras.main.midPoint.y;
    
                // Update the initial pointer position
                this.initialPointerPosition.set(pointer.x, pointer.y);
            }
        }, this);
    
        this.input.on('pointerup', function(pointer) {
            // Reset the initial pointer position when the dragging ends
            this.initialPointerPosition = null;
            this.joyStick.setEnable(true);
        }, this);
    }

    camGoToPlayer(delta) {
        let reachedPlayerX = false;
        let reachedPlayerY = false;
        this.cameras.main.centerOn(this.camFocusX, this.camFocusY);
        if (this.camFocusX > this.player.x+this.player.speed/20) {
            this.camFocusX = this.camFocusX - delta * this.player.speed/333;
        }
        else if (this.camFocusX < this.player.x-this.player.speed/20) {
            this.camFocusX = this.camFocusX + delta * this.player.speed/333;
        }
        else {
            this.camFocusX = this.player.x;
            reachedPlayerX = true;
        }
        if (this.camFocusY > this.player.y+this.player.speed/20) {
            this.camFocusY = this.camFocusY - delta * this.player.speed/333;
        } 
        else if (this.camFocusY < this.player.y-this.player.speed/20) {
            this.camFocusY = this.camFocusY + delta * this.player.speed/333;
        }
        else {
            this.camFocusY = this.player.y;
            reachedPlayerY = true;
        }
        if (reachedPlayerX && reachedPlayerY) {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setLerp(0.1, 0.1);
        }
    }

    updateTimer(delta) {
        if (this.timer && this.sceneDuration != -1000 && this.totaltime-this.sceneDuration/1000 > 0) {
            this.sceneDuration += delta;
            this.timerDisplay.setText("Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s");
        }
        else if (this.sceneDuration != -1000 && this.totaltime-this.sceneDuration/1000 <= 0) {
            this.endLevel();
        }
    }

    endLevel() {
        this.cameras.main.fade(1000, 0,0,0);
        this.sceneDuration = -1000;
        this.timerDisplay.setText("Time: 0.00s");
        this.joyStick.setEnable(false);
        this.inventoryButton.disableInteractive();
        this.interactButton.disableInteractive();
        this.onButton = true;
        //time limit for the next level
        let limit = 5;
        if (this.level == 1) {
            limit = 10;
        }
        else if (this.level == 2) {
            limit = 10;
        }
        else if (this.level == 3) {
            limit = 10;
        }
        this.time.delayedCall(1000, () => {
            this.scene.start("statistics", {stats: this.stats, items: this.player.items, limit: limit, level: this.level + 1});
        });
    }

    checkControls() {
        if (this.joyStick.left) {
            this.camFocusPlayer = true;
            this.moving.left = true;
        }
        else if (this.joyStick.right) {
            this.camFocusPlayer = true;
            this.moving.right = true;
        }
        else {
            this.moving.left = false;
            this.moving.right = false;
            if (this.player.anims.getName() == 'sideways')
                this.player.stopAnim();
        }

        if (this.joyStick.up) {
            this.camFocusPlayer = true;
            this.moving.up = true;
        }
        else if (this.joyStick.down) {
            this.camFocusPlayer = true;
            this.moving.down = true;
        }
        else {
            this.moving.up = false;
            this.moving.down = false;
            if (this.player.anims.getName() == 'up' || this.player.anims.getName() == 'down')
                this.player.stopAnim();
        }

        if (this.joyStick.noKey) {
            this.moving.left = false;
            this.moving.right = false;
            this.moving.up = false;
            this.moving.down = false;
            // this.player.stopAnim();
        }

        if (!this.timer && (this.moving.left || this.moving.right || this.moving.up || this.moving.down)) {
            this.timer = true;
        }
        
    }

    movePlayer() {
        // Horizontal movement
        if (this.moving.left) {
            this.player.flipX = true;
            if (!this.player.anims.isPlaying) 
                this.player.play("sideways");
            this.player.body.velocity.x = -this.player.speed;
        } else if (this.moving.right) {
            this.player.flipX = false;
            if (!this.player.anims.isPlaying) 
                this.player.play("sideways");
            this.player.body.velocity.x = this.player.speed;
        }
      
        // Vertical movement
        if (this.moving.up) {
            this.player.body.velocity.y = -this.player.speed;
            if (!this.player.anims.isPlaying) 
                this.player.play("up");
        } else if (this.moving.down) {
            this.player.body.velocity.y = this.player.speed;
            if (!this.player.anims.isPlaying) 
                this.player.play("down");
        }

        if (this.moving.left || this.moving.right || this.moving.up || this.moving.down) {
            this.stats.steps++;
        }
    }

}

class Entity extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, image, name, config) {
        super(scene, x, y, image);
        this.setScale(config.scale || 0.25).setDepth(config.depth || 1).setOrigin(config.origin || 0.5);
        this.scene = scene;
        this.scene.add.existing(this);
        this.name = name;
        this.imageKey = image;
        this.displayName = config.displayName || name;
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
    }

}

class Player extends Entity
{
    constructor(scene, x, y, name, config) {
        super(scene, x, y, 'playerRight', name, {scale:1, depth:2, origin:0.5});
        this.createAnimations();
        this.items = config.items || [];
        this.interacted = [];
        this.speed = config.speed || 100;
        this.body.setSize(this.width-5, this.height-10);
        this.body.setOffset(2.5, 10);
    }

    createAnimations() {
        this.anims.create({
            key: 'sideways',
            frames: this.anims.generateFrameNumbers("playerRight", { start: 0, end: 3 }),
            delay: 0,
            duration: null,
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers("playerUp", { start: 0, end: 3 }),
            delay: 0,
            duration: null,
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers("playerDown", { start: 0, end: 3 }),
            delay: 0,
            duration: null,
            frameRate: 4,
            repeat: -1,
        });
    }

    stopAnim() {
        if (this.anims.isPlaying) {
            this.anims.restart();
            this.anims.stop(null, true);
        }
    }

    gainItem(item) {
        this.items.push(item);
        this.interacted.push(item);
    }

    checkItem(checkItem, checkList) {
        let bruh = false;
        checkList.forEach(item => {
            if (item.name == checkItem.name)
                bruh = true;
        });
        return bruh;
    }

}

class Item extends Entity
{
    constructor(scene, x, y, name, image, config) {
        super(scene, x, y, image, name, config || {scale:0.25, depth:1, origin:0.5});
        this.description = config.description || "No description";
        this.fullName = config.fullName || name;
    }
    

}

