DEBUG = true;
Candy.Game = function(game){
	// define needed variables for Candy.Game
	this._player = null;
  this._power = null;
  this._candy = null;
  this._candySpeed = 200;
	this._candyGroup = null;
	this._spawnCandyTimer = 0;
	this._fontStyle = null;
	// define Candy variables to reuse them in Candy.item functions
	Candy._scoreText = null;
	Candy._score = 0;
	Candy._health = 0;
  this.cursors = null;

  this.bulletPool = null;
    this.layer1 = null;

};
Candy.Game.prototype = {
  bulletHitCandy: function(){
    this._candy.tint = Math.random() * 0xffffff;

  },

    reachedDoorEvent: function(sprite, tile){
        //this._candy.tint = Math.random() * 0xffffff;
        tile.alpha = 0.2;

        this.layer1.dirty = true;
        console.log("reachedDoorEvent");
        return false;

    },

	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// set the global gravity
		this.physics.arcade.gravity.x = 0;
		this.physics.arcade.gravity.y = 0;


        var map = this.add.tilemap('map1');
        map.addTilesetImage('tileset');
        map.setCollisionByExclusion([1]);
        this.layer1 = map.createLayer('Tile Layer 1');
        this.layer1.resizeWorld();
        map.setTileIndexCallback(4, this.reachedDoorEvent, this);

		// display images: background, floor and score
		this._candy = this.add.sprite(0, 0, 'candy');
        this._candy.anchor.setTo(0.5, 0.5);

    this.physics.enable(this._candy, Phaser.Physics.ARCADE);
    this._candy.body.setSize(20, 20, 0, 0);
  	this._power = this.add.sprite(this.world.centerX, this.world.centerY, 'power');
    this.physics.enable(this._power, Phaser.Physics.ARCADE);
    this._power.anchor.setTo(0.4, 0.5);
    this._power.body.setSize(60, 60, 0, 0);
    //this._power.angle = 90;

 // Create an object pool of bullets
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < 20; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }

    this.cursors = this.input.keyboard.createCursorKeys();
	},

  powerFire: function(){
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
        if (this.time.now - this.lastBulletShotAt < 1000) return;
        this.lastBulletShotAt = this.time.now;

        // Get a dead bullet from the pool
        var bullet = this.bulletPool.getFirstDead();

        // If there aren't any bullets available then don't shoot
        if (bullet === null || bullet === undefined) return;

        // Revive the bullet
        // This makes the bullet "alive"
        bullet.revive();

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;

        // Set the bullet position to the gun position.
        bullet.reset(this._power.x+30, this._power.y);
        bullet.body.velocity.x = Math.cos(this._power.rotation) * 130;
        bullet.body.velocity.y = Math.sin(this._power.rotation) * 130;
  },

	update: function(){
     this.physics.arcade.collide(this._candy, this.layer1);
     this._power.rotation = this.physics.arcade.angleBetween(this._power, this._candy);
     //console.log("this", this.bullletHitCandy);
     this.physics.arcade.overlap(this.bulletPool, this._candy, this.bulletHitCandy, null, this);

     if(this.physics.arcade.distanceBetween(this._power, this._candy) <= 60){
       this._power.frame = 1;

       this.powerFire();
     } else {
       this._power.frame = 0;
     }

    if (this.cursors.up.isDown) {
      this._candy.body.velocity.y = - this._candySpeed;
    } else if (this.cursors.down.isDown) {
      this._candy.body.velocity.y = this._candySpeed;
    } else if (this.cursors.left.isDown){
      this._candy.body.velocity.x = - this._candySpeed;
    } else if (this.cursors.right.isDown) {
      this._candy.body.velocity.x = this._candySpeed;
    } else {
      this._candy.body.velocity.setTo(0, 0);
    }

	},

  render : function(){
      if(DEBUG){
          this.game.debug.spriteInfo(this._power, 32, 32);
          this.game.debug.spriteInfo(this._candy, 32, 102);

          this.game.debug.body(this._candy);
          this.game.debug.body(this._power);
      }
  }

};