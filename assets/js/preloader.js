Candy.Preloader = function(game){
	// define width and height of the game
	Candy.GAME_WIDTH = 640;
	Candy.GAME_HEIGHT = 960;
};

Candy.Preloader.prototype = {
	preload: function(){
		this.stage.backgroundColor = '#B4D9E7';
		this.preloadBar = this.add.sprite((Candy.GAME_WIDTH-311)/2, (Candy.GAME_HEIGHT-27)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
    this.load.image('background', '../assets/images/background.png');
    this.load.spritesheet('power', '../assets/images/Power.png', 126, 100);
    this.load.image('bullet', '../assets/images/Bullet.png');
    this.load.image('tileset', '../assets/images/tileset.png');
    this.load.tilemap('map1', '../assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('candy', '../assets/images/candy.png', 82, 98);
    this.load.spritesheet('button-start', '../assets/images/button-start.png', 401, 143);
	},
	create: function(){
		this.state.start('MainMenu');
	}
};