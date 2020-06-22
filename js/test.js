window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();


function Game(canvas) {
	
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.controller = null;
}

Game.prototype = {
	
	constructor: Game,
	
	init: function() {		
	},
	
	run: function() {
		var scope = this;
		//load sprites
		ResourceManagerObject.load(['ameba.png', 'crveno-zrnce.png', 'virus.png', 'background.jpg', 'kapsula.png', 'gamestart.png',
		                            'rnk.png', 'dnk.png', 'blood.png', 'kraljica.png', 'gameover.png',
		                            'mehurici.png', 'brod.png', 'foreground.png', 'metak2.png', 'metak.png'], function() {
			AudioManagerObject.load(['explosion.wav', 'fire.wav'], function() {
				scope.runReal();
			});			
		});	 
	},
	
	runReal: function() {
				
		// Define scope
		var scope = this;
							
		function mouseDownCallback() {
			scope.controller.player.fire();
		}
		
		function mouseUpCallback() {
			scope.controller.player.stopFire();
		}		
		
		function mouseMoveCallback(x, y) {
			scope.controller.player.mouseMove(x, y);
		}
		
		var inputObject = createInputObject(false, false, mouseDownCallback, mouseUpCallback, mouseMoveCallback); //this object handles input with eyboard and mouse
		
		this.controller = createGameController(this.ctx, this.canvas.width, this.canvas.height, inputObject, 1);
				
//		setInterval(function(){
//			scope.update();
//		}, 16);
		
		scope.update();
	
	},
	
	// Handle mouse events
	handleMouseMove: function(event) {
		
		//var target = {x: event.pageX, y: event.pageY};
		var target = createVec(event.pageX, event.pageY, 0);
		//console.log('mouse @ ' + target.x + ' ' + target.y);
	
		this.controller.player.targetAt(target);
						
	},
	
	handleMouseDown: function(event) {		
		//console.log('mouse down!');
		var target = createVec(event.pageX, event.pageY, 0);
		
		var ps = createParticleEffect(this.controller, target, 20);
		this.controller.addEffect(ps);
		
		this.controller.player.fire();
		
	},
	
	handleMouseUp: function(event) {		
		//console.log('mouse Up!');

		this.controller.player.stopFire();
		
	},
	
	
	// Handle keyboard events
	handleKeyboard: function(event) {		
		// Key codes
		var KEY_LEFT 	= 65;
		var KEY_UP 		= 87;
		var KEY_RIGHT 	= 68;
		var KEY_DOWN 	= 83;
		var KEY_FIRE	= 32;
		
		var key = event.keyCode || event.charCode; 
		
//		console.log(key);
		
		switch (key)
		{
		
		case KEY_LEFT:
			//console.log('key left');
			this.controller.player.moveLeft();
			break;
		
		case KEY_RIGHT:
			//console.log('key right');
			this.controller.player.moveRight();
			break;
			
		case KEY_UP:
			//console.log('key up');
			this.controller.player.moveUp();
			break;
			
		case KEY_DOWN:
			//console.log('key down');
			this.controller.player.moveDown();
			break;
		
		};
		
	},
	
	update: function() {
		
		this.controller.update();
		this.draw();
		var that = this;
		
		requestAnimFrame(function() {
          that.update();
        });
		
	},
	
	draw: function() {
		
		this.ctx.fillStyle = '#000';
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.controller.draw(this.ctx);		
		
	}	
};

