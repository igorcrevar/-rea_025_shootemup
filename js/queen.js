// BACTERIA TYPE A
function createQueen(controller) {	
	var bacteria = createEnemy(controller, createVec(controller.width / 2, 50), 
			createVec(0, 1), 1.0, createVec(0, 1), 40, 5000);
	bacteria.STATE_MOVING = 0;
	bacteria.STATE_SHOOTING = 1;
	bacteria.STATE_SHAKE1 = 2;
	bacteria.STATE_CREATING = 3;
	bacteria.STATE_SHAKE2 = 4;
	bacteria.STATE_SPLITTING = 5;
	bacteria.STATE_FINAL = 6;
	bacteria.STATE_DEAD = 7;	
	
	bacteria.moveCounter = 0;
	bacteria.shootCounter = 0;
	bacteria.createCounter = 0;
	
	bacteria.moveTo = createVec(controller.width / 2, 120);
	bacteria.moveOffset = 100;
		
	bacteria.subType = "Queen";
	bacteria.state = bacteria.STATE_MOVING;	
	bacteria.shootRate = 20;
	bacteria.createRate = 300;
	bacteria.bulletSpeed = 8;
	bacteria.bulletDamage = 50;
	
	var animations = [ new Animation("anim", 0, 8, 128, 128, 6) ];    
	animations[0].setFrame(parseInt(Math.random() * 8, 10));
	animations[0].setDuration(parseInt(Math.random() * 5 + 1, 10));
    bacteria.sprite = new Sprite(animations, ResourceManagerObject.getResource('kraljica'));
        
	bacteria.update = function() {
		this.sprite.animate();
		
		// move
		this.pos = this.pos.add(this.direction.mult(this.speed));
		
		// left - right
		if (this.state != this.STATE_MOVING && this.state != this.STATE_SPLITTING) {
			this.moveCounter++;
			if (this.moveCounter > this.moveOffset) {
				this.moveCounter = 0;
				this.direction.x *= -1;
			}
		}
		
		if (this.state == this.STATE_MOVING) {
			if (this.pos.y > this.moveTo.y) {
				this.direction.x = 1;
				this.direction.y = 0;
				this.state = this.STATE_SHOOTING;
			}
		} else if (this.state == this.STATE_SHOOTING) {
			// shoot
			this._shoot();		
		} else if (this.state == this.STATE_CREATING) {
			// creating
			this._creating();
		} else if (this.state == this.STATE_SPLITTING) {
			if (this.pos.x == this.moveTo.x) {
				this.direction.x = 1;
				this.direction.y = 0;
				this.state = this.STATE_FINAL;
			}
		} else if (this.state == this.STATE_FINAL) {
			// shoot
			this._shoot();
			// creating
			this._creating();			
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeEnemy(this);
			this.controller.deadQueens++;
			if (this.controller.deadQueens == 2) {
				this.controller.state = this.controller.STATE_GAMEND;
			}
		}
	};
	
	bacteria.eventCollision = function(collisionEvent) {
		if (self.state == this.STATE_MOVING || self.state == this.STATE_SPLITTING) {
			return;
		}
		
		if (collisionEvent.obj1.type == "Bullet") {
			this.health -= collisionEvent.obj1.health;
			if (this.health <= 0) {
				if (this.state == this.STATE_SHOOTING) {
					this.state = this.STATE_SHAKE1;			
					this.moveOffset = 5;
					this.speed = 20;
					this.health = 1000;		
				} else if (this.state == this.STATE_SHAKE1) {
					this.state = this.STATE_CREATING;
					this.pos.x = this.controller.width / 2 + 100;
					this.direction.x = -1;
					this.moveCounter = 0;
					this.moveOffset = 100;
					this.speed = 2;
					this.health = 5000;	
				} else if (this.state == this.STATE_CREATING) {
					this.state = this.STATE_SHAKE2;			
					this.moveOffset = 5;
					this.speed = 40;
					this.health = 1000;		
				} else if (this.state == this.STATE_SHAKE2) {
					this.state = this.STATE_SPLITTING;
					this.pos.x = this.controller.width / 2;
					this.moveCounter = 0;
					this.shootRate = 30;
					this.createRate = 400;
					this.moveOffset = 100;
					this.speed = 1;
					this.health = 5000;
					this.direction.x = -1;
					this.moveTo.x = this.pos.x - 70;
					
					// split
					var queen2 = createQueen(this.controller);
					queen2.state = this.STATE_SPLITTING;
					queen2.pos = createVec(this.pos.x, this.pos.y);
					queen2.moveTo.x = this.pos.x + 70;
					queen2.direction = createVec(1, 0);
					queen2.shootRate = 30;
					queen2.createRate = 400;
					this.controller.addEnemy(queen2);
					
				} else if (this.state == this.STATE_FINAL) {
					this.state = this.STATE_DEAD;
				} 
			}
		}
	};
	
	bacteria._shoot = function() {
		this.shootCounter++;
		if (this.shootCounter == this.shootRate) {
			this.shootCounter = 0;
			
			var x = (Math.random() * 2) - 1;
			var y = Math.random();
			if (x == 0 && y == 0) {
				y = 1.0;
			}
			var direction = createVec(x, y).unit();
			
			var bullet = createBacteriaBulletA(this.controller, createVec(this.pos.x + Math.random() * 100 - 50, this.pos.y), 
					direction, this.bulletSpeed, direction, 10, this.bulletDamage);
			this.controller.addEnemyBullet(bullet);
			
			if (Math.random() < 0.4) {
				var bulletL = createBacteriaBulletA(this.controller, createVec(this.pos.x + Math.random() * 100 - 50, this.pos.y), 
						createVec(-1, 0), this.bulletSpeed, createVec(-1, 0), 10, this.bulletDamage);
				this.controller.addEnemyBullet(bulletL);
			}
			
			if (Math.random() < 0.4) {
				var bulletR = createBacteriaBulletA(this.controller, createVec(this.pos.x + Math.random() * 100 - 50, this.pos.y), 
						createVec(1, 0), this.bulletSpeed, createVec(1, 0), 10, this.bulletDamage);
				this.controller.addEnemyBullet(bulletR);
			}
		}
	};
	
	bacteria._creating = function() {
		this.createCounter++;
		if (this.createCounter == this.createRate) {
			this.createCounter = 0;
			
			var x = (Math.random() * 2) - 1;
			var y = Math.random();
			if (x == 0 && y == 0) {
				y = 1.0;
			}
			var direction = createVec(x, y).unit();
			
			var bacteriaA = createBacteriaA(this.controller, createVec(this.pos.x + Math.random() * 100 - 50, this.pos.y), 
					direction, 2.5, direction, 15.0, 
					350, 
					Math.random() * 100, 
					40, 8, 60, 
					15, 700);
			this.controller.addEnemy(bacteriaA);
			
			eff = createParticleEffect(this.controller, bacteriaA.pos, 5);
			this.controller.addEffect(eff);
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