/**
 * This file contains implementation of virus objects.
 * There are two types of viruses:
 * 
 * - VirusA  
 *   This type of viruses can only move toward the target. It cannot fire.
 *   
 * - VirusB
 *   This virus type moves to chosen point near player. When it reaches that
 *   point, it takes new point near player and goes to it.
 * */


/**
 * This method creates virus of type A.
 */
function createVirusA(controller, pos, direction, speed, orient, health){
	var virus = createEnemy(controller, pos, direction, speed, orient, 10, health);
	
	virus.subType = "VirusA";
	
	virus.STATE_MOVING = 0;
	virus.STATE_DEAD = 1;
	
	virus.state = virus.STATE_MOVING;
	

   var animations = [
	   //name, imageYOffset, frames, frameWidth, frameHeight, durationEachFrame
      new Animation("anim", 0, 8, 512 / 8, 64, 3),
   ];    
   animations[0].setFrame(parseInt(Math.random() * 8, 10));
   animations[0].setDuration(parseInt(Math.random() * 3 + 3, 10));
   virus.sprite = new Sprite(animations, ResourceManagerObject.getResource('virus'));
	
	virus.update = function() {
		if (this.state == this.STATE_MOVING) {
			this.sprite.animate();
			var angle = Math.random() * Math.PI * 2;
			var x = this.controller.player.pos.x + Math.cos(angle) * this.boundRadius * 20; 
			var y = this.controller.player.pos.y + Math.sin(angle) * this.boundRadius * 20;
		
			var randomPoint = createVec(x,y);
			this.direction = randomPoint.sub(this.pos).unit();
		
			this.pos = this.pos.add(this.direction.mult(this.speed));
		}else if(this.state == this.STATE_DEAD){
			eff = createParticleEffect(this.controller, this.pos, 15);
			this.controller.addEffect(eff);
			this.controller.removeEnemy(this);			

			// create item
			if (Math.random() < 0.2) {
				var virusItem = createVirusItem(this.controller, createVec(this.pos.x, this.pos.y), 
						createVec(0, 1), 2.0, createVec(0, 1), 5.0);				
				this.controller.addItem(virusItem);	
			}
		}
	};
	
	virus.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		this.sprite.draw(ctx);
		ctx.restore();
	};
	
	virus.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Bullet") {
			AudioManagerObject.play('explosion');
			this.state = this.STATE_DEAD;
		} else if (collisionEvent.obj1.type == "Player"){ 
			this.state = this.STATE_DEAD;
		}
	};
	
	return virus;
}

/**
 * This method creates virus of type B
 */
function createVirusB(controller, pos, direction, speed, orient, health){
	var virus = createEnemy(controller, pos, direction, speed, orient, 10, health);
	
	virus.subType = "VirusB";
	
	virus.STATE_MOVING = 0;
	virus.STATE_DEAD = 1;
	
	virus.state = virus.STATE_MOVING;
	
	virus.pointToGo = undefined;
	virus.xToGo = undefined;
	virus.yToGo = undefined;
	
	 var animations = [ new Animation("anim", 0, 8, 512 / 8, 64, 3) ];
	 animations[0].setFrame(parseInt(Math.random() * 8, 10));
	 animations[0].setDuration(parseInt(Math.random() * 3 + 3, 10));
	 virus.sprite = new Sprite(animations, ResourceManagerObject.getResource('virus'));
	
	virus.update = function() {
		if (this.state == this.STATE_MOVING) {
			this.sprite.animate();
			if(this.xToGo == undefined){
				var angle = Math.random() * Math.PI * 2;
				this.xToGo = this.controller.player.pos.x + Math.cos(angle) * this.boundRadius * 5; 
				this.yToGo = this.controller.player.pos.y + Math.sin(angle) * this.boundRadius * 5;
				
				this.pointToGo = createVec(this.xToGo, this.yToGo);
				
			}
			else{
				var tempX = this.pos.x - this.xToGo;
				var tempY = this.pos.y - this.yToGo;
				
				var intensity = Math.sqrt(tempX * tempX + tempY * tempY);
				if(intensity < 10){
					this.xToGo = undefined;
					this.yToGo = undefined;
				}
				
			}
			var x = this.xToGo - this.pos.x;
			var y = this.yToGo - this.pos.y;
			var mag = 1 / Math.sqrt(x * x + y * y);
			this.direction.x = x*mag;
			this.direction.y = y*mag;
			
			this.pos = this.pos.add(this.direction.mult(this.speed));			
		}else if(this.state == this.STATE_DEAD){
			eff = createParticleEffect(this.controller, this.pos, 15);
			this.controller.addEffect(eff);
			this.controller.removeEnemy(this);

			// create item
			if (Math.random() < 0.25) {
				var virusItem = createVirusItem(this.controller, createVec(this.pos.x, this.pos.y), 
						createVec(0, 1), 2.0, createVec(0, 1), 5.0);				
				this.controller.addItem(virusItem);	
			}
		}

	};
	
	virus.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		this.sprite.draw(ctx);
		ctx.restore();
	};

	virus.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Bullet") {
			AudioManagerObject.play('explosion');
			this.state = this.STATE_DEAD;
		} else if (collisionEvent.obj1.type == "Player"){ 
			this.state = this.STATE_DEAD;
		}
		
	};
	
	return virus;
	
}