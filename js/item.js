
// VIRUS ITEM
function createVirusItem(controller, pos, direction, speed, orient, boundRadius) {	
	boundRadius = 32;
	var virusItem = createItem(controller, pos, direction, speed, orient, boundRadius, 0);
	virusItem.STATE_MOVING = 0;
	virusItem.STATE_DEAD = 1;
	virusItem.STATE_OUT = 2;
	
	virusItem.subType = "VirusItem";
	virusItem.state = virusItem.STATE_MOVING;
	virusItem.angle = 0;
	virusItem.angleInc = Math.PI / 50;
	
	virusItem.update = function() {
		//this.sprite.animate();
		if (this.state == this.STATE_MOVING) {
			// move
			this.pos = this.pos.add(this.direction.mult(speed));
			this.angle += this.angleInc;
			
			// out of screen
			if (this.isOutOfScreen(0, 0)) {
				this.state = this.STATE_OUT;
			}
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeItem(this);
		} else if (this.state == this.STATE_OUT) {
			// out of screen
			this.controller.removeItem(this);
		}		
	};
	
	virusItem.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Player") {
			this.state = this.STATE_DEAD;
		}
	};
	
	virusItem.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		var image = ResourceManagerObject.getResource('rnk');
		ctx.drawImage(image, -32, -32, 64, 64);			
		ctx.restore();
	};
	
	return virusItem;	
}


//BACTERIA ITEM
function createBacteriaItem(controller, pos, direction, speed, orient, boundRadius) {	
	boundRadius = 32;
	var bacteriaItem = createItem(controller, pos, direction, speed, orient, boundRadius, 0);
	bacteriaItem.STATE_MOVING = 0;
	bacteriaItem.STATE_DEAD = 1;
	bacteriaItem.STATE_OUT = 2;
	
	bacteriaItem.subType = "BacteriaItem";
	bacteriaItem.state = bacteriaItem.STATE_MOVING;
	bacteriaItem.angleInc = Math.PI / 50;
	bacteriaItem.angle = 0;
	
	bacteriaItem.update = function() {
		//this.sprite.animate();
		if (this.state == this.STATE_MOVING) {
			// move
			this.pos = this.pos.add(this.direction.mult(speed));

			this.angle += this.angleInc;
			// out of screen
			if (this.isOutOfScreen(0, 0)) {
				this.state = this.STATE_OUT;
			}
		} else if (this.state == this.STATE_DEAD) {
			// dead
			this.controller.removeItem(this);
		} else if (this.state == this.STATE_OUT) {
			// out of screen
			this.controller.removeItem(this);
		}		
	};
	
	bacteriaItem.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Player") {
			this.state = this.STATE_DEAD;
		}
	};
	
	bacteriaItem.draw = function(ctx) {		
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		var image = ResourceManagerObject.getResource('dnk');
		ctx.drawImage(image, -32, -32, 64, 64);
		ctx.restore();
	};
	
	return bacteriaItem;	
}
