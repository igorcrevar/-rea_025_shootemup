
// SPORE TYPE A
function createSporeA(controller, pos, direction, speed, orient, boundRadius, health, moveRadius, angleSpeed) {	
	var spore = createEnemy(controller, pos, direction, speed, orient, boundRadius, health);
	spore.STATE_MOVING = 0;
	spore.STATE_DEAD = 1;
	
	spore.subType = "Spore";
	spore.state = spore.STATE_MOVING;
	spore.moveRadius = moveRadius || 50;
	spore.pivot = createVec(pos.x, pos.y, pos.z);
	spore.angle = 0;
	spore.angleSpeed = angleSpeed;
	
	spore.update = function() {
		if (this.state == this.STATE_MOVING) {
			// move			
			this.pivot = this.pivot.add(this.direction.mult(speed));
			this.angle += this.angleSpeed;
			var offset = createVec(Math.cos(this.angle) * this.moveRadius, Math.sin(this.angle) * this.moveRadius);
			this.pos = this.pivot.add(offset);			

			// out of screen
			if (this.isOutOfScreen()) {
				this.state = this.STATE_DEAD;
			}			
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeEnemy(this);
			// TODO create spore
		}
	};
	
	spore.eventCollision = function(collisionEvent) {
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
	
	spore.draw = function(ctx) {		
		ctx.fillStyle = '#888800';		
		ctx.save();
		ctx.fillRect(this.pos.x - 4, this.pos.y - 4, 6, 6);
		ctx.restore();
	};
	
	return spore;	
}