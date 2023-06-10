class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
    }

    preload() {
        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        this.load.plugin('rexlocalstoragedataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlocalstoragedataplugin.min.js', true);

        this.load.path = './data/';
        this.load.tilemapTiledJSON("map", "Getting_Old_Tilemap_large_v1.1.1.json");
        // this.load.tilemapTiledJSON("map", "rpgtilemap.tmj");

        this.load.path = './assets/tilemap/';
        this.load.image("tiles", "First Asset pack.png");
        // this.load.image("tiles", "kenney_tiny-town/Tilemap/tilemap.png");
        // this.load.tilemapTiledJSON("map", "test.tmj");
        this.load.path = './assets/images/';
        // this.load.image('playerImage', 'placeholder3.png');
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');
        this.load.image('movementArrow', 'movementArrow.png');
        this.load.image('interactButton', 'interactButton.png');
        this.load.image('inventoryButton', 'inventoryButton.png');
        
        this.load.path = './assets/images/character/';
        this.load.spritesheet('playerRight', 'ACharRight.png', { frameWidth: 13, frameHeight: 18 });
        // this.load.spritesheet('player', 'character.png', { frameWidth: 13, frameHeight: 19 });
        this.load.spritesheet('playerUp', 'ACharUp.png', { frameWidth: 14, frameHeight: 19 });
        this.load.spritesheet('playerDown', 'ACharDown.png', { frameWidth: 14, frameHeight: 19 });

        this.load.path = './assets/sounds/';
        this.load.audio('bgMusic', "miamiSong.wav");
        this.load.audio('plink', "plink.mp3")

    }
    
    create ()
    {   
        this.itemInfo = null;
        this.items = [];
        this.muteMusic = (localStorage.getItem("bgMute") == "true" ? true : false);;

        fetch("./data/itemInfo.json").then(
            (response) => response.json()
        ).then(
            (json) => {
                console.log(json);
                this.itemInfo = json;
                // console.log(this.itemInfo["items"]["");
                for (const key in this.itemInfo){
                    console.log(`${key} : ${this.itemInfo[key]["displayName"]}`)
                    let currentItem = this.itemInfo[key];
                    this.items.push(new Item(this, currentItem["coordinates"]["x"], currentItem["coordinates"]["y"], key, currentItem["imageKey"], {
                            displayName:currentItem["displayName"], 
                            fullName:currentItem["fullName"], 
                            description:currentItem["description"]
                        }));
                }
            }
        );
        
        this.bgMusic = this.sound.add('bgMusic', { loop: true });
        if (!this.muteMusic) {
            this.bgMusic.play();
        }
        console.log(this)
        this.player = (new Player(this, 20, 145, 'InputName', {speed:100, items:[]}));


        // console.log(this.player);
        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("rpgtileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        // const belowLayer = map.createLayer("below", tileset, 0, 0);
        // const worldLayer = map.createLayer("world", tileset, 0, 0);
        // const aboveLayer = map.createLayer("above", tileset, 0, 0);
        // aboveLayer.setDepth(10);
        // console.log( tileset.getTileLayerNames());
        const ground = map.createLayer("Ground", tileset, 0, 0);
        const cliffs = map.createLayer("Cliffs", tileset, 0, 0);
        const cliffs2 = map.createLayer("Cliffs 2", tileset, 0, 0);
        const plants1 = map.createLayer("Plants", tileset, 0, 0);
        const plants2 = map.createLayer("Plants 2", tileset, 0, 0);
        const plants3 = map.createLayer("Plants 3", tileset, 0, 0);
        const plants4 = map.createLayer("Plants 4", tileset, 0, 0);
        const fences = map.createLayer("Fences", tileset, 0, 0);
        const buildings = map.createLayer("Buildings", tileset, 0, 0);
        const collision = map.createLayer("Collision", tileset, 0, 0);

        collision.setCollisionBetween(1, 999, true, 'Collision');

        // worldLayer.setCollisionByProperty({ collides: true });
        // worldLayer.setCollisionBetween(1, 999, true, 'world');
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        collision.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });

        collision.forEachTile(function(tile, index, tileArray) {
            tile.setAlpha(0);
        })
            
        this.physics.add.collider(this.player, collision);
        this.makeUI();
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.camFocusX = this.player.x;
        this.camFocusY = this.player.y;
        this.camFocusPlayer = false;
        console.log(this.cameras.main)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.setLerp(0.1, 0.1);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.onJoyStick = false;
        this.joyStick.on('pointerdown', (pointer) => {this.onJoyStick = true;})
        this.joyStick.on('pointerup', (pointer) => {this.onJoyStick = false;});

        // allows player to click and drag to see the area around the player
        this.initialPointerPosition = null;
        this.input.on('pointerdown', function(pointer) {
            console.log(this.onJoyStick)
            // this.time.delayedCall(500, () => {
                if (!this.onJoyStick) {
                // if (!(this.moving.left || this.moving.right || this.moving.up || this.moving.down)){
                    this.camFocusPlayer = false;
                    // Store the initial pointer position
                    this.initialPointerPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
                    // console.log(this.initialPointerPosition)
                    this.cameras.main.stopFollow();
                }
            // });
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
        }, this);

        this.sceneDuration = 0;
        this.timer = 0;
        this.startTime = 0;
        this.totaltime = 90;
        
        this.delta = 0;
        this.moving = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

    }
    
    update(time, delta) {
        this.delta = delta;
        this.sceneDuration = this.sys.game.loop.time - this.startTime;
        this.timerDisplay.setText("Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s");
        // Stop any previous movement from the last frame
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

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
            this.player.stopAnim();
        }

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

        let reachedPlayerX = false;
        let reachedPlayerY = false;
        if (this.camFocusPlayer) {
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
      
    }

    makeUI() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/
        this.timerDisplay = this.add.text(400, 30, "Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s", {font: "40px Arial", fill: "#FFFFFF"});
        this.timerDisplay.setOrigin(0.5, 0.5).setScrollFactor(0);
        let { width, height } = this.sys.game.canvas;

        this.add.text(400, this.player.y-50, "arrows to move, \ninteract while touching an item to pick it up, \ntap inventory to open inventory")

        // this.leftJoystick = this.rexUI.add.virtualJoystick({
        //     x: 50,
        //     y: height-100,
        //     radius: 50,
        //     base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.5),
        //     thumb: this.add.circle(0, 0, 25, 0x888888),
        //     dir: '8dir',
        //     input: this.input
        // })
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 315,
            y: 350,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.5),
            thumb: this.add.circle(0, 0, 25, 0x888888),
            dir: '8dir',
            // forceMin: 16,
            // fixed: true,
            // enable: true
        }); 

        // this.leftArrow = this.add.image(290, 350, "movementArrow").setScrollFactor(0).setScale(0.5).setOrigin(0.5).setRotation(-Math.PI/2).setAlpha(0.5);
        // this.rightArrow = this.add.image(340, 350, "movementArrow").setScrollFactor(0).setScale(0.5).setOrigin(0.5).setRotation(Math.PI/2).setAlpha(0.5);
        // this.upArrow = this.add.image(315, 325, "movementArrow").setScrollFactor(0).setScale(0.5).setOrigin(0.5).setAlpha(0.5);
        // this.downArrow = this.add.image(315, 375, "movementArrow").setScrollFactor(0).setScale(0.5).setOrigin(0.5).setRotation(Math.PI).setAlpha(0.5);
        this.inventoryButton = this.add.image(315, 240, "inventoryButton").setScrollFactor(0).setScale(0.75).setOrigin(0.5).setAlpha(0.5);
        this.interactButton = this.add.image(490, 350, "interactButton").setScrollFactor(0).setScale(0.75).setOrigin(0.5).setAlpha(0.5);
        //settings in top right corner
        this.settingsButton = this.add.text(490, 240, "Mute").setScrollFactor(0).setScale(0.75).setOrigin(0.5);
        this.settingsButton.setText(this.muteMusic ? "Unmute" : "Mute");

        this.settingsButton.setInteractive({useHandCursor: true});
        this.settingsButton.on('pointerdown', () => {
            this.muteMusic = !this.muteMusic;
            localStorage.setItem("bgMute", this.muteMusic);
            if (this.muteMusic) {
                this.settingsButton.setText("Unmute");
                this.bgMusic.stop();
            }
            else {
                this.settingsButton.setText("Mute");
                this.bgMusic.play();
            }
        });

        let plinkNoise = this.sound.add('plink', { loop: false });

        this.inventoryButton.setInteractive({useHandCursor: true});
        this.inventoryButton.on('pointerdown', () => {
            plinkNoise.play();
            this.scene.pause('intro');
            this.scene.launch('inventory', {items:this.player.items});
        });

        this.interactButton.setInteractive({useHandCursor: true});
        this.interactButton.on('pointerdown', () => {
            this.items.forEach(item => {
                if (!this.player.inInventory(item)) {
                    this.physics.overlap(this.player.body, item.body, (player, itemBody) =>
                    {   
                        this.player.gainItem({
                            name:item.name, 
                            fullName:item.fullName,
                            displayName:item.displayName,
                            imageKey:item.imageKey,
                            description:item.description
                        });
                        plinkNoise.play();
                    });
                }
            });
        });
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
    }

    inInventory(checkItem) {
        let bruh = false;
        this.items.forEach(item => {
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

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#257098',
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
    scene: [Intro, Inventory]
};

const game = new Phaser.Game(config);
