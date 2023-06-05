class Intro extends Phaser.Scene
{   
    constructor() {
        super('intro')
    }

    preload() {
        this.load.image("tiles", "../assets/kenney_tiny-town/Tilemap/tilemap.png");
        this.load.tilemapTiledJSON("map", "../assets/test.tmj");
    }
    
    create ()
    {
        console.log(Phaser)
        this.player = this.add.rectangle(400, 300, 50, 50, 0x00ff00).setDepth(1);
        this.physics.add.existing(this.player);
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
        // const cam = this.cameras.main;
        this.camFocusX = this.player.x;
        this.camFocusY = this.player.y;

        this.item = new Item(this, this.player.x, this.player.y, 'item');
        // this.cursors.down.onDown(() => {
        //     this.item.visual.y += 10;
        
        // })
        // this.physics.overlap(this.player.body, this.item.visual.body, (player, item) =>
        // {
        //     if (this.cursors.space.isDown)
        //     {
        //         this.item.visual.destroy();
        //     }
        //     console.log("over")
        // });
    }

    update(time, delta) {
        // Stop any previous movement from the last frame
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.cameras.main.centerOn(this.camFocusX, this.camFocusY);
      
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -100;
            if (this.camFocusX > this.player.x - 50)
                this.camFocusX = this.camFocusX - delta * 0.15;
        } else if (this.cursors.right.isDown) {
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
            // else {
            //     this.camFocusY = this.player.y + 100;
            // }
        }

        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
            
        }
        else {
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
            this.physics.overlap(this.player.body, this.item.visual.body, (player, item) =>
            {
                // if (this.cursors.space.isDown)
                // {
                    this.item.visual.destroy();
                // }
                console.log("over")
            });
        }
      
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        // this.player.body.velocity.normalize().scale(this.player.velocity);
      }

}

class Item {
    constructor(scene, x, y, name) {
        this.scene = scene;
        this.name = name;
        this.visual = this.scene.add.rectangle(x, y, 50, 50, 0xffffff).setOrigin(0.5);
        this.scene.physics.add.existing(this.visual);
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
    scene: [Intro]
};

const game = new Phaser.Game(config);
