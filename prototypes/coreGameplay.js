class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("tiles", "kenney_tiny-town/Tilemap/tilemap.png");
        this.load.tilemapTiledJSON("map", "test.tmj");
        this.load.path = './assets/images/';
        this.load.image('playerImage', 'placeholder3.png');
        this.load.image('item1', 'placeholder7-bow.png');
        this.load.image('item2', 'placeholder6-arrow.png');
        this.load.path = './assets/sounds/';
        this.load.audio('bgMusic', "miamiSong.wav");
        this.load.audio('plink', "plink.mp3")
    }
    
    create ()
    {
        let bgMusic = this.sound.add('bgMusic', { loop: true });
        bgMusic.play();
        console.log(this)
        this.player = (new Player(this, 400, 300, 'playerImage'));
        // this.add.sprite(400, 300, 'playerImage');
        // console.log(Phaser.GameObjects.Sprite)
        // this.player = this.add.rectangle(400, 300, 50, 50, 0x00ff00).setDepth(1);
        // this.physics.add.existing(this.player);
        console.log(this.player);
        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("tilemap", "tiles");

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

        this.items = [];
        this.items.push(new Item(this, 20, 400, 'bow', 'item1', {displayName:'Placeholder-Bow'}));
        this.items.push(new Item(this, 300, 600, 'arrow', 'item2', {displayName:'Placeholder-Arrow'}));

        this.sceneDuration = 0;
        this.timer = 0;
        this.startTime = 0;
        this.totaltime = 90;
        this.timerDisplay = this.add.text(400, 30, "Time: " + (this.totaltime-this.sceneDuration/1000).toFixed(2) + "s", {font: "40px Arial", fill: "#FFFFFF"});
        this.timerDisplay.setOrigin(0.5, 0.5).setScrollFactor(0);

        this.add.text(400, this.player.y-50, "arrows to move, \ninteract while touching an item to pick it up, \ntap inventory to open inventory")
        this.leftArrow = this.add.text(50, 500, "<", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.rightArrow = this.add.text(100, 500, ">", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.upArrow = this.add.text(75, 475,  "^", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.downArrow = this.add.text(75, 525, "v", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.inventoryButton = this.add.text(20, 20, "Inventory", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.interactButton = this.add.text(600, 500, "Interact", {font: "40px Arial", fill: "#FFEA00"}).setScrollFactor(0);
        this.delta = 0;
        this.moving = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
        //move player left when clicked
        this.leftArrow.setInteractive({useHandCursor: true});
        this.leftArrow.on('pointerdown', () => {
            this.moving.left = true;
        })
        .on('pointerout', () => {
            this.moving.left = false;
        })
        .on('pointerup', () => {
            this.moving.left = false;
        });
        this.rightArrow.setInteractive({useHandCursor: true});
        this.rightArrow.on('pointerdown', () => {
            this.moving.right = true;
        })
        .on('pointerout', () => {
            this.moving.right = false;
        })
        .on('pointerup', () => {
            this.moving.right = false;
        });
        this.upArrow.setInteractive({useHandCursor: true});
        this.upArrow.on('pointerdown', () => {
            this.moving.up = true;
        })
        .on('pointerout', () => {
            this.moving.up = false;
        })
        .on('pointerup', () => {
            this.moving.up = false;
        });
        this.downArrow.setInteractive({useHandCursor: true});
        this.downArrow.on('pointerdown', () => {
            this.moving.down = true;
        })
        .on('pointerout', () => {
            this.moving.down = false;
        })
        .on('pointerup', () => {
            this.moving.down = false;
        });

        this.inventoryButton.setInteractive({useHandCursor: true});
        this.inventoryButton.on('pointerdown', () => {
            let plinkNoise = this.sound.add('plink', { loop: false });
            plinkNoise.play();
            this.scene.pause('intro');
            this.scene.launch('inventory', {items:this.player.items});
        });

        this.interactButton.setInteractive({useHandCursor: true});
        this.interactButton.on('pointerdown', () => {
            this.items.forEach(item => {
                this.physics.overlap(this.player.body, item.body, (player, itemBody) =>
                {   
                    this.player.gainItem({
                        name:item.name, 
                        displayName:item.displayName,
                        imageKey:item.imageKey
                    });
                    item.destroy();
                    console.log("over")
                    let plinkNoise = this.sound.add('plink', { loop: false });
                    plinkNoise.play();
                });
            });
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
            this.player.body.velocity.x = -100;
            if (this.camFocusX > this.player.x - 50)
                this.camFocusX = this.camFocusX - delta * 0.15;
        } else if (this.moving.right) {
            this.player.flipX = false;
            this.player.body.velocity.x = 100;
            if (this.camFocusX < this.player.x + 50)
                this.camFocusX = this.camFocusX + delta * 0.15;
        }
      
        // Vertical movement
        if (this.moving.up) {
            this.player.body.velocity.y = -100;
            if (this.camFocusY > this.player.y - 50)
                this.camFocusY = this.camFocusY - delta * 0.15;
        } else if (this.moving.down) {
            this.player.body.velocity.y = 100;
            if (this.camFocusY < this.player.y + 50) {
                this.camFocusY = this.camFocusY + delta * 0.15;
            }
        }

        if (!(this.moving.left || this.moving.right || this.moving.up || this.moving.down)) {
            if (this.camFocusX > this.player.x+5) {
                this.camFocusX = this.camFocusX - delta * 0.3;
            }
            else if (this.camFocusX < this.player.x-5) {
                this.camFocusX = this.camFocusX + delta * 0.3;
            }
            else {
                this.camFocusX = this.player.x;
            }
            if (this.camFocusY > this.player.y+5) {
                this.camFocusY = this.camFocusY - delta * 0.3;
            } 
            else if (this.camFocusY < this.player.y-5) {
                this.camFocusY = this.camFocusY + delta * 0.3;
            }
            else {
                this.camFocusY = this.player.y;
            }
            // this.camAnimOffset = Math.max(this.camAnimOffset - delta * 0.1, 0)
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
    }

}

class Player extends Entity
{
    constructor(scene, x, y, name, items) {
        super(scene, x, y, 'playerImage', name, {scale:0.25, depth:2, origin:0.5});
        this.items = items || [];
    }

    gainItem(item) {
        this.items.push(item);
    }

}

class Item extends Entity
{
    constructor(scene, x, y, name, image, config) {
        super(scene, x, y, image, name, config || {scale:0.25, depth:1, origin:0.5});
    }

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#257098',
    parent: 'phaser-example',
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 } // Top down game, so no gravity
        }
    },
    scene: [Intro, Inventory]
};

const game = new Phaser.Game(config);
