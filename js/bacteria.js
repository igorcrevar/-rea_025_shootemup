// BACTERIA BULLET
function createBacteriaBulletA(controller, pos, direction, speed, orient, boundRadius, health) {
	var bullet = createBullet(controller, pos, direction, speed, orient, false, boundRadius, health);
	bullet.STATE_MOVING = 0;
	bullet.STATE_DEAD = 1;
	
	bullet.subType = "BacteriaBullet";
	bullet.state = bullet.STATE_MOVING;
	
	bullet.update = function() {
		if (this.state == this.STATE_MOVING) {
			// move
			this.pos = this.pos.add(this.direction.mult(this.speed));
			
			// out of screen
			if (this.isOutOfScreen()) {
				this.state = this.STATE_DEAD;
			}
			
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeEnemyBullet(this);
		}
	};
	
	bullet.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Player") {
			this.state = this.STATE_DEAD;
		} 
	};
	
	bullet.draw = function(ctx) {		
		ctx.save();
		
		var image = ResourceManagerObject.getResource('metak2');
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		ctx.drawImage(image, -16, -16, 32, 32);
		
		ctx.restore();
	};
	
	return bullet;	
}


// BACTERIA TYPE A
function createBacteriaA(controller, pos, direction, speed, orient, boundRadius, health, moveRadius, shootRate, bulletSpeed, bulletDamage, sporeNumber, splitRate) {	
	var bacteria = createEnemy(controller, pos, direction, speed, orient, boundRadius, health);
	bacteria.STATE_MOVING = 0;
	bacteria.STATE_DEAD = 1;
	bacteria.STATE_OUT = 2;
	
	bacteria.shootCounter = 0;
	bacteria.splitCounter = 0;
	
	bacteria.subType = "Bacteria";
	bacteria.state = bacteria.STATE_MOVING;
	bacteria.moveRadius = moveRadius || 50;
	bacteria.angle = 0;
	bacteria.angleSpeed = 0.1;
	bacteria.translateOffset = 0;
	bacteria.shootRate = shootRate || 100;
	bacteria.bulletSpeed = bulletSpeed || 10;
	bacteria.bulletDamage = bulletDamage || 50;
	bacteria.sporeNumber = sporeNumber || 100;
	bacteria.splitRate = splitRate || -1;
	
	var animations = [ new Animation("anim", 0, 8, 576 / 8, 64, 6) ];    
	animations[0].setFrame(parseInt(Math.random() * 8, 10));
	animations[0].setDuration(parseInt(Math.random() * 3 + 3, 10));
    bacteria.sprite = new Sprite(animations, ResourceManagerObject.getResource('ameba'));
    
    bacteria.angleSpeed = Math.random() * Math.PI / 80;
    bacteria.angle = 0;
    
	bacteria.update = function() {
		this.angle += this.angleSpeed;
		if (this.angle > 2 * Math.PI) {
			this.angle = this.angle - 2 * Math.PI;
		}
		this.sprite.animate();
		this.shootCounter++;
		if (this.splitRate != -1) {
			this.splitCounter++;			
		}
		
		if (this.state == this.STATE_MOVING) {
			// move
			this.angle += this.angleSpeed;
			var x = Math.cos(this.angle) * bacteria.moveRadius + this.translateOffset;
			this.direction = createVec(x, 10.0).unit();
			
			this.pos = this.pos.add(this.direction.mult(speed));

			// out of screen
			if (this.isOutOfScreen(50, 100)) {
				this.state = this.STATE_OUT;
			}

			// shoot
			if (this.shootCounter == this.shootRate) {
				this.shootCounter = 0;
				this.translateOffset = 0;
								
				var x = Math.round((Math.random() * 3) - 1.5);
				var y = Math.round((Math.random() * 3) - 1.5);
				if (x == 0 && y == 0) {
					y = 1.0;
				}
				var direction = createVec(x, y).unit();
				var bullet = createBacteriaBulletA(this.controller, createVec(this.pos.x, this.pos.y), direction, this.bulletSpeed, direction, 9, this.bulletDamage);
				this.controller.addEnemyBullet(bullet);
			}
			
			// split
			if (this.splitCounter == this.splitRate) {
				this.splitCounter = 0;
				this.translateOffset = -100;
				var clone = createBacteriaA(this.controller, createVec(this.pos.x, this.pos.y), 
						createVec(0, 1), this.speed, createVec(0, 1), this.boundRadius, 
						this.health * 2, 
						this.moveRadius * 2, this.shootRate / 2, this.bulletSpeed, this.bulletDamage * 2,
						this.sporeNumber * 2, this.splitRate);	
				clone.translateOffset = 100;
				this.controller.addEnemy(clone);							
			}
			
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeEnemy(this);

			// create spore
			for (var i = 0; i < this.sporeNumber; i++) {
				var x = Math.random() * 3 - 1.5;
				var y = Math.random() * 3 - 1.5;
				if (x == 0 && y == 0) {
					y = 1.0;
				}
				var direction = createVec(x, y).unit();
				var sporeSpeed = Math.random() * 3;
				var moveRadius = Math.random() * 50;
				var angleSpeed = Math.random() * 0.25 + 0.1;
				
				var spore = createSporeA(this.controller,  createVec(this.pos.x, this.pos.y), 
						direction, sporeSpeed, direction, 
						10, this.bulletDamage, moveRadius, angleSpeed);
				this.controller.addEnemy(spore);				
			}	
			
			// create item
			if (Math.random() < 0.2) {
				var bacteriaItem = createBacteriaItem(this.controller, createVec(this.pos.x, this.pos.y), 
						createVec(0, 1), 1.0, createVec(0, 1), 5.0);				
				this.controller.addItem(bacteriaItem);	
			}
			
		} else if (this.state == this.STATE_OUT) {
			this.controller.removeEnemy(this);
		}
		
	};
	
	bacteria.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Player") {
			this.state = this.STATE_DEAD;
		} else if (collisionEvent.obj1.type == "Bullet") {
			this.health -= collisionEvent.obj1.health;
			if (this.health <= 0) {
				AudioManagerObject.play('explosion');
				this.state = this.STATE_DEAD;
			}
		}
	};
	
	bacteria.draw = function(ctx) {		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		this.sprite.draw(ctx);
		ctx.restore();
	};
	
	return bacteria;	
}





