class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
    }

    preload() {
        this.load.path = './data/';
        this.load.tilemapTiledJSON("map", "rpgtilemap.tmj");

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
        


        let bgMusic = this.sound.add('bgMusic', { loop: true });
        bgMusic.play();
        console.log(this)
        this.player = (new Player(this, 400, 300, 'InputName', {speed:300, items:[]}));

        // console.log(Phaser.GameObjects.Sprite)

        // console.log(this.player);
        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("rpgtileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer("below", tileset, 0, 0);
        const worldLayer = map.createLayer("world", tileset, 0, 0);
        const aboveLayer = map.createLayer("above", tileset, 0, 0);
        aboveLayer.setDepth(10);

        worldLayer.setCollisionByProperty({ collides: true });

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        //     });
            
        this.physics.add.collider(this.player, worldLayer);

        this.camFocusX = this.player.x;
        this.camFocusY = this.player.y;
        // this.cameras.main.startFollow(this.player);
        // this.cameras.main.setZoom();
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // this.items = [];
        // this.items.push(new Item(this, 20, 400, 'bow', 'item1', {displayName:'Placeholder-Bow'}));
        // this.items.push(new Item(this, 300, 600, 'arrow', 'item2', {displayName:'Placeholder-Arrow'}));

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
        this.makeUI();

        //move player left when clicked
        this.leftArrow.setInteractive({useHandCursor: true});
        this.leftArrow.on('pointerdown', () => {
            this.moving.left = true;
            this.player.play("sideways");
        })
        .on('pointerout', () => {
            this.moving.left = false;
            this.player.stopAnim();
        })
        .on('pointerup', () => {
            this.moving.left = false;
            this.player.stopAnim();
        });
        this.rightArrow.setInteractive({useHandCursor: true});
        this.rightArrow.on('pointerdown', () => {
            this.moving.right = true;
            this.player.play("sideways");
        })
        .on('pointerout', () => {
            this.moving.right = false;
            this.player.stopAnim();
        })
        .on('pointerup', () => {
            this.moving.right = false;
            this.player.stopAnim();
        });
        this.upArrow.setInteractive({useHandCursor: true});
        this.upArrow.on('pointerdown', () => {
            this.moving.up = true;
            this.player.play("up");

        })
        .on('pointerout', () => {
            this.moving.up = false;
            this.player.stopAnim();
        })
        .on('pointerup', () => {
            this.moving.up = false;
            this.player.stopAnim();
        });
        this.downArrow.setInteractive({useHandCursor: true});
        this.downArrow.on('pointerdown', () => {
            this.moving.down = true;
            this.player.play("down");

        })
        .on('pointerout', () => {
            this.moving.down = false;
            this.player.stopAnim();
        })
        .on('pointerup', () => {
            this.moving.down = false;
            this.player.stopAnim();
        });

    }    

    update(time, delta) {
        this.delta = delta;
        this.sceneDuration = this.sys.game.loop.time - this.startTime;
        this.timerDisplay.setText("Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s");
        // Stop any previous movement from the last frame
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.cameras.main.centerOn(this.camFocusX, this.camFocusY);
      
        // Horizontal movement
        if (this.moving.left) {
            this.player.flipX = true;
            this.player.body.velocity.x = -this.player.speed;
            if (this.camFocusX > this.player.x - this.player.speed/2)
                this.camFocusX = this.camFocusX - delta * this.player.speed/667;
        } else if (this.moving.right) {
            this.player.flipX = false;
            this.player.body.velocity.x = this.player.speed;
            if (this.camFocusX < this.player.x + this.player.speed/2)
                this.camFocusX = this.camFocusX + delta * this.player.speed/667;
        }
      
        // Vertical movement
        if (this.moving.up) {
            this.player.body.velocity.y = -this.player.speed;
            if (this.camFocusY > this.player.y - this.player.speed/2)
                this.camFocusY = this.camFocusY - delta * this.player.speed/667;
        } else if (this.moving.down) {
            this.player.body.velocity.y = this.player.speed;
            if (this.camFocusY < this.player.y + this.player.speed/2) {
                this.camFocusY = this.camFocusY + delta * this.player.speed/667;
            }
        }

        if (!(this.moving.left || this.moving.right || this.moving.up || this.moving.down)) {
            if (this.camFocusX > this.player.x+this.player.speed/20) {
                this.camFocusX = this.camFocusX - delta * this.player.speed/333;
            }
            else if (this.camFocusX < this.player.x-this.player.speed/20) {
                this.camFocusX = this.camFocusX + delta * this.player.speed/333;
            }
            else {
                this.camFocusX = this.player.x;
            }
            if (this.camFocusY > this.player.y+this.player.speed/20) {
                this.camFocusY = this.camFocusY - delta * this.player.speed/333;
            } 
            else if (this.camFocusY < this.player.y-this.player.speed/20) {
                this.camFocusY = this.camFocusY + delta * this.player.speed/333;
            }
            else {
                this.camFocusY = this.player.y;
            }
            // this.camAnimOffset = Math.max(this.camAnimOffset - delta * 0.1, 0)
        }
      
    }

    makeUI() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/
        this.timerDisplay = this.add.text(400, 30, "Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s", {font: "40px Arial", fill: "#FFFFFF"});
        this.timerDisplay.setOrigin(0.5, 0.5).setScrollFactor(0);
        let { width, height } = this.sys.game.canvas;

        this.add.text(400, this.player.y-50, "arrows to move, \ninteract while touching an item to pick it up, \ntap inventory to open inventory")

        this.leftArrow = this.add.image(50, height-100, "movementArrow").setScrollFactor(0).setScale(1).setOrigin(0.5).setRotation(-Math.PI/2);
        this.rightArrow = this.add.image(150, height-100, "movementArrow").setScrollFactor(0).setScale(1).setOrigin(0.5).setRotation(Math.PI/2);
        this.upArrow = this.add.image(100, height-150, "movementArrow").setScrollFactor(0).setScale(1).setOrigin(0.5);
        this.downArrow = this.add.image(100, height-50, "movementArrow").setScrollFactor(0).setScale(1).setOrigin(0.5).setRotation(Math.PI);
        this.inventoryButton = this.add.image(100, 75, "inventoryButton").setScrollFactor(0).setScale(2).setOrigin(0.5);
        this.interactButton = this.add.image(width-90, height-100, "interactButton").setScrollFactor(0).setScale(2).setOrigin(0.5);

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
    }

}

class Player extends Entity
{
    constructor(scene, x, y, name, config) {
        super(scene, x, y, 'playerRight', name, {scale:1, depth:2, origin:0.5});
        this.createAnimations();
        this.items = config.items || [];
        this.speed = config.speed || 100;
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
        }
    },
    scene: [Intro, Inventory]
};

const game = new Phaser.Game(config);
