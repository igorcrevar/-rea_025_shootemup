/**
 * This script contains object model for "ShootemUp" game.
 * 
 * Game contains following objects:
 * 
 * - GAME_OBJECT:
 *     Game object is parent object that groups behavior of all game objects
 *     to one place.
 *     GameObject prototype just shows methods common to all game objects so
 *     they can easily be found.
 * 
 * - PLAYER
 *     Player is created with createPlayer method and represents player in game.
 *     in single player mode there will be only one player.
 * - ENEMY
 *     TODO  - change implementation... Currently only one type of enemy exists.
 * - BULLET
 *     Bullet is created with createBullet method and represent fired bullet.
 *     Bullet can be fired by player and by enemy. This object holds flag that
 *     determines if bullet is fired by player. This flag can be used to check
 *     collision so enemy can't kill other enemies.
 * - ITEM
 *     Item is created with createItem method and represents item that player 
 *     can pick.
 *     
 * @author area025
 * @date 2012-12-15
 * */

//*****************************************************************************

/**
 * Game object is generic object that holds common behavior.
 * 
 * @param controller  Object - game controller object.
 * @param pos         Vector - initial position of enemy.
 * @param direction   Vector - direction where enemy is moving.
 * @param speed       Number - speed of enemy.
 * @param orient      Vector - orientation where enemy is facing.
 * @param boundRadius Number - radius for collision.
 * 
 * @returns new game object
 */
function GameObject(controller, pos, direction, speed, orient, boundRadius, health){
	this.controller = controller;
	this.type = "GameObject";
	this.pos = pos;
	this.direction = direction;
	this.speed = speed;
	this.orient = orient;
	this.boundRadius = boundRadius;
	this.health = health;
};

GameObject.prototype = {
	/**
	 * Answers is game object alive.
	 */
	isAlive : function(){},
	/**
	 * Updates current state of object.
	 */
	update: function(){
		this.pos = this.pos.add(this.direction.mult(this.speed));
	},
	/**
	 * Object is notified if it is in collision with other object.
	 */
	eventCollision: function(collisionEvent){},
	/**
	 * Answers if object can be in collision with other objects.
	 */
	isCollidable: function(){},
	/**
	 * Answers should given object be drawn.
	 */
	isDrawable: function(){},
	
	isOutOfScreen: function(offX, offY) {
		offX = offX || 0;
		offY = offY || 0;
		return !(this.pos.x > -offX && this.pos.x < this.controller.width + offX &&
				this.pos.y > -offY && this.pos.y < this.controller.height + offY);
	},
	
	/*
	 * make coord inside boundary. if it wasnt inside boundary return false 
	 */
	updateBounds: function(coord) {
		var max = coord == 'x' ? this.controller.width : this.controller.height;
		if (this.pos[coord] < 0) {
			this.pos[coord] = 0;
			return false;
		}
		else if (this.pos[coord] > max ) {
			this.pos[coord] = max;
			return false;
		}
		
		return true;
	},
	
	/**
	 * Draws game object.
	 */
	draw: function(ctx){
		
		// Convert direction to angle
		var angle = Math.atan2(-this.direction.x, this.direction.y);
				
		ctx.fillStyle = 'white';
		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(angle);
		ctx.fillRect(0-6, 0-6, 12, 12);
		ctx.restore();
		
	}
};


//*****************************************************************************
//                         CREATING GAME OBJECTS                              * 
//*****************************************************************************

/**
 * Creates new player object.
 */
function createPlayer(controller, inputObject, pos, direction, speed, orient, boundRadius, health){
	speed = 0.1;
	var KEY_LEFT 	= 65;
	var KEY_UP 		= 87;
	var KEY_RIGHT 	= 68;
	var KEY_DOWN 	= 83;
	var player = new GameObject(controller, pos, direction, speed, orient, boundRadius, health);	
	player.type = "Player";
	player.acc = createVec(0, 0, 0);
	var friction = 0.05;

    player.sprite = ResourceManagerObject.getResource('brod');
	    
	player.points = 0;
	player.isInFire = false;
	player.fireCounter = 0;
	player.target = createVec(pos.x, pos.y, 0);
	player.angleDirection = 0;
	
	player.isShieldActive = false;
	player.shieldTimer = 0;
	player.isDnkActive = 0;
	player.dnkTimer = 0;
	player.dnkShootTimer = 0;
	
	player.bubbleGeneratorIncrement = 0;
	
	player.updateShield = function(timer) {
		var timerInt = parseInt(timer, 10);
		var el1 = document.getElementById('player_shield_active_div');
		var el2 = document.getElementById('player_shield_active');
		this.isShieldActive = timerInt >= 0;
		el1.style.display = this.isShieldActive ? 'block' : 'none';
		el2.innerHTML = timerInt;
		this.shieldTimer = timer;
	};
	
	player.updateDnk = function(timer) {
		var timerInt = parseInt(timer, 10);
		var el1 = document.getElementById('shooting_div');
		var el2 = document.getElementById('shooting_span');
		this.isDnkActive = timerInt >= 0;
		el1.style.display = this.isDnkActive ? 'block' : 'none';
		el2.innerHTML = timerInt;
		this.dnkTimer = timer;
	};
	
	player.updatePoints = function(no) {
		this.points += no;
		var el = document.getElementById('player_points');
		el.innerHTML = this.points;  
	};
	
	player.updateAcc = function(coord, inc, min, max) {
		this.acc[coord] += inc;
		if (this.acc[coord] > max) {
			this.acc[coord] = max;
		}
		else if (this.acc[coord] < min) {
			this.acc[coord] = min;
		}
	};
	
	player.applyFriction = function(coord) {
		if (this.acc[coord] > 0) {
			this.acc[coord] -= friction;
			if (this.acc[coord] < 0) {
				this.acc[coord] = 0;
			}
		}
		else if (this.acc[coord] < 0) {
			this.acc[coord] += friction;
			if (this.acc[coord] > 0) {
				this.acc[coord] = 0;
			}
		}
	}; 
	
	// Fire some bullets! :)
	player.fire = function() {		
		this.isInFire = true;
		this.fireCounter = 0;
	};
	
	player.stopFire = function() {
		player.isInFire = false;
	};
	
	player.moveLeft = function() {
		this.updateAcc('x', -speed, -6, 6);
		/*
		var x = Math.cos(-Math.PI / 2) * this.direction.x - Math.sin(-Math.PI / 2) * this.direction.y;
		var y = Math.cos(-Math.PI / 2) * this.direction.y + Math.sin(-Math.PI / 2) * this.direction.x;
		this.updateAcc('y', y * speed , -6, 6);
		this.updateAcc('x', x * speed , -6, 6);
		*/
	};	
	
	player.moveRight = function() {
		this.updateAcc('x', speed, -6, 6);
		/*
		var x = Math.cos(Math.PI / 2) * this.direction.x - Math.sin(Math.PI / 2) * this.direction.y;
		var y = Math.cos(Math.PI / 2) * this.direction.y + Math.sin(Math.PI / 2) * this.direction.x;
		this.updateAcc('y', y * speed , -6, 6);
		this.updateAcc('x', x * speed , -6, 6);
		*/
	};
	
	player.moveUp = function() {
		this.updateAcc('y', -speed , -6, 6);
		//this.updateAcc('y', this.direction.y * speed , -6, 6);
		//this.updateAcc('x', this.direction.x * speed , -6, 6);
	};
	
	player.moveDown = function() {
		this.updateAcc('y', speed, -6, 6);
		//this.updateAcc('y', -this.direction.y * speed , -6, 6);
		//this.updateAcc('x', -this.direction.x * speed , -6, 6);
	};	
	
	player.mouseMove = function(x, y) {
		var vec = createVec(x, y, 0);
		this.angleDirection = vec.sub(this.pos).unit();
	};
	
	player.update = function() {
		this.bubbleGeneratorIncrement += 0.5;
		if (this.bubbleGeneratorIncrement >= 1 ) {
			var bubble = createBubbleEffect(this.controller, this.pos, this);
			this.controller.addEffect(bubble);
			this.bubbleGeneratorIncrement = 0;
		}
		
		if (this.isShieldActive) {
			this.updateShield(this.shieldTimer - 0.02);			
		}
		
		if (this.isDnkActive) {
			this.updateDnk(this.dnkTimer - 0.02);
			this.dnkShootTimer++;
			if (this.dnkShootTimer >= 60) {
				var anglePI = Math.PI / 4;
				for (var ii = 0; ii < 4; ++ii) {
					var xx = Math.cos(anglePI) * this.direction.x - Math.sin(anglePI) * this.direction.y;
					var yy = Math.cos(anglePI) * this.direction.y + Math.sin(anglePI) * this.direction.x;
					var direction = createVec(xx, yy).unit();
					//controller, pos, direction, speed, orient, playerBullet, boundRadius, health, player
					var bullet = createPlayerBullet(this.controller, createVec(this.pos.x + 6, this.pos.y + 6), direction, 
													3, direction, true, 9, 100, this);
					bullet.res = 'metak2';
					this.controller.addPlayerBullet(bullet);
					anglePI += Math.PI * 2 / 4;
				}
				this.dnkShootTimer = 0;
			}		
		}
		
		this.target.x = inputObject.getMouseX();
		this.target.y = inputObject.getMouseY();		
		if (inputObject.isKeyPressed(KEY_LEFT)) {
			this.moveLeft();
		}		
		else if (inputObject.isKeyPressed(KEY_RIGHT)) {
			this.moveRight();
		}
		
		if (inputObject.isKeyPressed(KEY_UP)) {
			this.moveUp();
		}		
		else if (inputObject.isKeyPressed(KEY_DOWN)) {
			this.moveDown();
		}
		
		this.direction = this.target.sub(this.pos).unit();
		this.applyFriction('x');
		this.applyFriction('y');
		
		this.pos.x += this.acc.x;
		this.pos.y += this.acc.y;
		if (!this.updateBounds('x')) {
			this.acc['x'] = -this.acc['x'];
		}
		if (!this.updateBounds('y')) {
			this.acc['y'] = -this.acc['y'];
		}

		if (this.isInFire) {		
						
			if (this.fireCounter == 0) {
				
				var orient = Math.atan2(-this.direction.x, this.direction.y);
//				var angles = [orient-0.25, orient, orient+0.25];

				var bullet = createPlayerBullet(this.controller, createVec(pos.x + 6, pos.y + 6), this.direction, 10, orient, true, 10, 100, this);
				this.controller.addPlayerBullet(bullet);			
				
			}
				
			this.fireCounter++;
			if (this.fireCounter == 12) {
				this.fireCounter = 0;
			}
		}
	};
	
	player.draw = function(ctx) {		
		// Convert direction to angle
		var angle = Math.atan2(-this.angleDirection.x, this.angleDirection.y);
		if (angle > Math.PI) {
			angle = Math.PI;
		}
				
		ctx.fillStyle = 'white';
		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(angle + Math.PI);
		var image = ResourceManagerObject.getResource('brod');
		ctx.drawImage(image, 0, 0, image.width, image.height, -32, -32, image.width, image.height);
		ctx.restore();
		
	};
	
	player.updateHealth = function(inc) {
		if (this.isShieldActive) {
			document.getElementById('player_health').innerHTML = this.health;
			return;
		}
		this.health += inc;
		document.getElementById('player_health').innerHTML = this.health;
		if (this.health <= 0) {
			this.controller.state = this.controller.STATE_GAMEOVER;
		}
	};
	
	player.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj2.type) {
			console.log(collisionEvent.obj2.type)
		}
		if (collisionEvent.obj2.type == "Bullet") {
			this.updateHealth(-collisionEvent.obj2.health);
		} else if (collisionEvent.obj2.type == "Enemy") {
			this.updateHealth(-collisionEvent.obj2.health);
		}
		else if (collisionEvent.obj2.type == "Health"){
			this.updateHealth(collisionEvent.obj2.health);
		}
		else if (collisionEvent.obj2.subType == "VirusItem") {
			//this.updateHealth(-collisionEvent.obj2.health);
			//TODO: virus item shield
			this.updateShield(10);
		}
		else if (collisionEvent.obj2.subType == "BacteriaItem") {
			//this.updateHealth(-collisionEvent.obj2.health);
			//TODO: bacteria item pucanje	
			this.dnkShootTimer = 0;
			this.updateDnk(10);
		}
	};	
	
	player.updateDnk(0);
	player.updateShield(0); //updateHUD
	player.updateHealth(0); //update HUD
	
	return player;
}

/**
 * Creates new enemy object.
 */
function createEnemy(controller, pos, direction, speed, orient, boundRadius, health){
	var enemy = new GameObject(controller,pos, direction, speed, orient, boundRadius, health);
	
	enemy.type = "Enemy";
	enemy.state = 0;
	enemy.innerCounter = 0;

	enemy.update = function() {
		this.pos = this.pos.add(this.direction.mult(this.speed));
	};
	
	enemy.draw = function(ctx) {
		
		// Convert direction to angle
		var angle = Math.atan2(-this.direction.x, this.direction.y);
				
		ctx.fillStyle = 'white';
		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(angle);
		ctx.fillRect(0-6, 0-6, 12, 12);
		ctx.restore();
		
	};
	
	return enemy;
}

/**
 * Creates new bullet. Bullet is {@link GameObject} with additional property
 * "playerBullet" that determines if bullet is fired by player or enemy.
 * 
 * @see GameObject
 */
function createBullet(controller, pos, direction, speed, orient, playerBullet, boundRadius, health){
	var bullet = new GameObject(controller, pos, direction, speed, orient, boundRadius, health);
	bullet.type = "Bullet";
	bullet.playerBullet = playerBullet;		
	return bullet;
}

/**
 * Creates new item.
 */
function createItem(controller, pos, direction, speed, orient, boundRadius, health){
	var	item = new GameObject(controller, pos, direction, speed, orient, boundRadius, health);
	item.type = "Item";
	return item;
}


/* Create simple particle effect */
function createParticleEffect(controller, pos, numParticles) {
	
	var ps = new GameObject(controller, pos, createVec(0, 0), 0, createVec(0, 0), 10, 100);
	ps.type = 'ParticleSystem';
	ps.numParticles = numParticles;
	
	 var animations = [ new Animation("anim", 0, 8, 512 / 8, 64, 6) ];    
	 animations[0].setDuration(parseInt(Math.random() * 3 + 3, 10));
	 ps.sprite = new Sprite(animations, ResourceManagerObject.getResource('blood'));
	
	ps.particles = new Array();
	for (var i=0; i<ps.numParticles; ++i) {
		
		var x = Math.random()*16;
		var y = Math.random()*16;
		var angle = Math.random()*2*Math.PI;
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);
		var speed = Math.random()*2.0 + 1.0;
		var life = 25;
		
		ps.particles.push( {x:x, y:y, dx:dx, dy:dy, s: speed, l:life} );

	}
	
	ps.update = function() {
		
		if (this.particles.length == 0 ) {
		
			this.controller.removeEffect(this);
			return;
		
		}
		
		for (var i=0; i<this.particles.length; ++i) {
			
			var p = this.particles[i];
			
			if ( p.l > 0 ) {
				
				p.x += p.dx;
				p.y += p.dy;
				p.speed *= 0.95;
				p.l--;
				
			} else {
				
				this.particles.splice(i, 1);
				
			}
						
		}
		
		this.sprite.animate();
		
	};
	
	ps.draw = function(ctx) {
		
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.translate(this.pos.x, this.pos.y);
		ctx.scale(1.6, 1.6);
		this.sprite.draw(ctx);
		
//		for (var i=0; i<this.particles.length; ++i) {
//			
//			ctx.save();
//			//ctx.translate(this.particles[i].x, this.particles[i].y);
//			
//			//ctx.fillRect(this.particles[i].x, this.particles.y, 4, 4);
//			ctx.restore();
//			
//		}
		ctx.restore();
		
	};
	
	return ps;
}

function createPlayerBullet(controller, pos, direction, speed, orient, playerBullet, boundRadius, health, player) {
	var bullet = new GameObject(controller, pos, direction, speed, orient, boundRadius, health, player);
	bullet.type = "Bullet";
	bullet.STATE_MOVING = 0;
	bullet.STATE_DEAD = 1;
	bullet.state = bullet.STATE_MOVING;
	bullet.player = player;
	AudioManagerObject.play('fire');
	//define bullet 
	bullet.eventCollision = function(collisionObj) {
		this.controller.removePlayerBullet(this);
		this.player.updatePoints(20);				
	};
	
	bullet.update = function() {
		if (this.state == this.STATE_MOVING) {
			// move
			this.pos = this.pos.add(this.direction.mult(speed));
			
			// out of screen
			if (this.isOutOfScreen()) {
				this.state = this.STATE_DEAD;
			}
			
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removePlayerBullet(this);
		}
	};
	
	bullet.draw = function(ctx) {
		
		// Convert direction to angle
		var angle = Math.atan2(-this.direction.x, this.direction.y);
				
		ctx.fillStyle = 'orange';
		var img = ResourceManagerObject.getResource(this.res ? this.res : 'metak');
		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(angle);
		//ctx.fillRect(0-6, 0-6, 12, 12);
		
		ctx.drawImage(img, 0-10, 0-10, 20, 20);
		
		ctx.restore();
		
	};
	
	return bullet;
}

function createBubbleEffect(controller, pos, player) {
	var x = Math.cos(Math.PI) * player.direction.x - Math.sin(Math.PI) * player.direction.y;
	var y = Math.cos(Math.PI) * player.direction.y + Math.sin(Math.PI) * player.direction.x;
	var posStart = createVec(pos.x + x * 12, pos.y + y * 32);
    var bubble = new GameObject(controller, posStart, createVec(x, y), 1.0, createVec(0, -1), 1.0, 100, player);
	
	bubble.angle = Math.random() * 2 * Math.PI;
	bubble.alpha = 1.0;
	bubble.speed = 1.5;
		
			
	bubble.update = function() {
	
		this.angle += 0.02;
		this.alpha *= 0.985;
		this.pos = this.pos.add(this.direction.mult(this.speed));
		
		if ( this.alpha <= 0.05 ) {
			
			this.controller.removeEffect(this);
			this.alpha = 0;
		}
		
	};
	
	bubble.draw = function(ctx) {
		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		var image = ResourceManagerObject.getResource('mehurici');
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(image, -16, -16, 32, 32);
				
		ctx.restore();
		
	};
	
	return bubble;
}
	
var createCorpuscle = function(controller) {
	var _x =  Math.random() < 0.5 ? 500 : 0;
	var _y = Math.random() * 500;
	var speed = _x == 500 ? -Math.random() - 1 : Math.random() + 1;
	var obj = new GameObject(controller, createVec(_x, _y), createVec(_x, _y), speed, createVec(0, -1), 1.0, 100);	
	obj.angle = 0;
	obj.angleSpeed = Math.random() * Math.PI / 40;
	
	var animations = [
 	   //name, imageYOffset, frames, frameWidth, frameHeight, durationEachFrame
       new Animation("anim", 0, 8, 512 / 8, 64, 3),
    ];    
	
    animations[0].setDuration(parseInt(Math.random() * 3 + 3, 10));
    obj.sprite = new Sprite(animations, ResourceManagerObject.getResource('crveno-zrnce'));
	                
	controller.addBackgroundSprite(obj);
	obj.update = function() {
		if (this.isOutOfScreen()) {
			controller.removeBackgroundSprite(this);
		}
		else {
			this.pos.x += this.speed;
			this.angle += this.angleSpeed;
			//this.pos.y += Math.sin(this.angle) * 2;
		}			
		obj.sprite.animate();
	};
	
	obj.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		ctx.globalAlpha = 0.5;
		this.sprite.setZoom(0.6);
		this.sprite.draw(ctx);
		ctx.restore();
	};	
	
	return obj;
};
