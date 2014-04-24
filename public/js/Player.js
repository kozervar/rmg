/**
 * Created by Marcin Kozaczyk on 24.04.14.
 */
Player = function (game, x, y, uuid) {

    Phaser.Sprite.call(this, game, x, y, 'player');

    this.game = game;
    this.uuid = uuid;

    this.MAX_SPEED = 250; // pixels/second
    this.ACCELERATION = 600; // pixels/second/second
    this.DRAG = 400; // pixels/second
    this.JUMP_SPEED = -600; // pixels/second (negative y is up)

    this.canDoubleJump = true;

    // Set the pivot point of the person to the center of the texture
    this.anchor.setTo(0.5, 0.5);
    // Enable physics on the player
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // Make player collide with world boundaries so he doesn't leave the stage
    this.body.collideWorldBounds = true;
    // Set player minimum and maximum movement speed
    this.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    // Add drag to the player that slows them down when they are not accelerating
    this.body.drag.setTo(this.DRAG, 0); // x, y

    this.game.add.existing(this);

    console.debug("Player added: " + this.uuid);
};

// Missiles are a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.collide = function(obj){
    this.game.physics.arcade.collide(this, obj);
};
Player.prototype.createPlayer = function(){
    this.game.add.existing(this);
};
Player.prototype.destroyPlayer = function(){
    this.destroy(this);
};
Player.prototype.update = function(){

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        // If the LEFT key is down, set the player velocity to move left
        this.body.acceleration.x = -this.ACCELERATION;
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        // If the RIGHT key is down, set the player velocity to move right
        this.body.acceleration.x = this.ACCELERATION;
    } else {
        this.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.body.touching.down;
    if (onTheGround) this.canDoubleJump = true;

    if (this.game.input.keyboard.justPressed(Phaser.Keyboard.UP, 1)) {
        if (this.canDoubleJump || onTheGround) {
            // Jump when the player is touching the ground or they can double jump
            this.body.velocity.y = this.JUMP_SPEED;

            // Disable ability to double jump if the player is jumping in the air
            if (!onTheGround) this.canDoubleJump = false;
        }
    }
};

