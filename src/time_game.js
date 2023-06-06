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

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        this.cursors = this.input.keyboard.createCursorKeys();
        console.log(this.cursors);
        this.physics.add.collider(this.player, worldLayer);

        this.camFocusX = this.player.x;
        this.camFocusY = this.player.y;

        this.item = new Item(this, 20, 400, 'Placeholder-Bow');
    }

    update(time, delta) {
        // Stop any previous movement from the last frame
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.cameras.main.centerOn(this.camFocusX, this.camFocusY);
      
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.flipX = true;
            this.player.body.velocity.x = -100;
            if (this.camFocusX > this.player.x - 50)
                this.camFocusX = this.camFocusX - delta * 0.15;
        } else if (this.cursors.right.isDown) {
            this.player.flipX = false;
            this.player.body.velocity.x = 100;
            if (this.camFocusX < this.player.x + 50)
                this.camFocusX = this.camFocusX + delta * 0.15;
        }
      
        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -100;
            if (this.camFocusY > this.player.y - 50)
                this.camFocusY = this.camFocusY - delta * 0.15;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 100;
            if (this.camFocusY < this.player.y + 50) {
                this.camFocusY = this.camFocusY + delta * 0.15;
            }
        }

        if (!(this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown)) {
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

        if (this.cursors.space.isDown) {
            console.log('space pressed');
            this.physics.overlap(this.player.body, this.item.body, (player, item) =>
            {   
                this.player.gainItem(this.item.name);
                this.item.destroy();
                console.log("over")
                let plinkNoise = this.sound.add('plink', { loop: false });
                plinkNoise.play();
            });
        }
        if (this.cursors.shift.isDown) {
            let plinkNoise = this.sound.add('plink', { loop: false });
            plinkNoise.play();
            this.scene.pause('intro');
            this.scene.launch('inventory', {items:this.player.items});
        }
      
      }

}

class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, name, items) {
        super(scene, x, y, 'playerImage');
        this.setScale(0.25).setDepth(2).setOrigin(0.5);
        this.scene = scene;
        this.scene.add.existing(this);
        this.name = name;
        this.items = items || [];
        this.scene.physics.add.existing(this);
    }

    gainItem(item) {
        this.items.push(item);
    }

}

class Item extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, name) {
        super(scene, x, y, 'item1');
        this.setScale(0.2).setDepth(1).setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene = scene;
        this.name = name;
        this.scene.physics.add.existing(this);
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
