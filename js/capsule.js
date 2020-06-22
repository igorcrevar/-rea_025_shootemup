/**
 * This file implements capsule game object.
 * 
 * Capsule game object only moves down... It doesn't fire or move left or right.
 * */

function createCapsule(controller, pos, direction, speed, orient, health, sporeNumber){
	var capsule =  createEnemy(controller, pos, direction, speed, orient, 10, health);	
	capsule.subType = "Capsule";
	
	capsule.STATE_MOVING = 0;
	capsule.STATE_DEAD = 1;
	capsule.STATE_DESTROYED = 2;
	
	capsule.state = capsule.STATE_MOVING;
	capsule.sporeNumber = sporeNumber || 100;
	
	capsule.update = function(){
		if(this.state == this.STATE_MOVING){
			this.pos.y = this.pos.y + this.speed;
		}else if(this.state == this.STATE_DEAD){
			this.controller.removeEnemy(this);
			
			if(Math.random() < 0.5){
				// create spore
				for (var i = 0; i < this.sporeNumber; i++) {
					var x = Math.random() * 3 - 1.5;
					var y = Math.random() * 3 - 1.5;
					if (x == 0 && y == 0) {
						y = 1.0;
					}
					var direction = createVec(x, y).unit();
					var sporeSpeed = Math.random() * 10;
					var moveRadius = Math.random() * 100;
					var angleSpeed = Math.random() * 0.5 + 0.1;
					
					var spore = createSporeA(this.controller,  createVec(this.pos.x, this.pos.y), 
							direction, sporeSpeed, direction, 
							10, 10, moveRadius, angleSpeed);
					this.controller.addEnemy(spore);				
				}	
			}else{
				var item = createAidKitItem(this.controller, this.pos, this.speed);
				this.controller.addItem(item);
			}
			
		}else if(this.state == this.STATE_DESTROYED){
			this.controller.removeEnemy(this);
		}
	};
	
	capsule.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x - 16, this.pos.y - 16);
		var image = ResourceManagerObject.getResource('kapsula');
		ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
		ctx.restore();
	};
	
	capsule.eventCollision = function(collisionEvent) {
		if (collisionEvent.obj1.type == "Bullet") {
			this.state = this.STATE_DEAD;
		} else if (collisionEvent.obj1.type == "Player"){ 
			this.state = this.STATE_DESTROYED;
		}
	};
	
	return capsule;
}


function createAidKitItem(controller, pos, speed){
	//controller, pos, direction, speed, orient, boundRadius, health
	var firstAid = createItem(controller, pos, createVec(0,-1), speed, createVec(0,0), 10, 20);
	
	firstAid.type = "Health";
	
	firstAid.STATE_MOVING = 0;
	firstAid.STATE_PICKED = 1;
	
	firstAid.state = firstAid.STATE_MOVING;
	
	firstAid.update = function(){
		if(this.state == this.STATE_MOVING){
			this.pos.y = this.pos.y + 0.3;
		}else if(this.state == this.STATE_PICKED){
			this.controller.removeItem(this);
		}
	};
	
	firstAid.draw = function(ctx){
		
		ctx.fillStyle = 'white';
		ctx.fillRect(this.pos.x-15, this.pos.y-10, 30, 20);
		
		ctx.fillStyle = 'red';
		ctx.fillRect(this.pos.x-10, this.pos.y-4, 20, 8);
		ctx.fillRect(this.pos.x-4, this.pos.y-7, 8, 14);
		
//		var image = ResourceManagerObject.getResource('first_aid');
//		ctx.save();
//		ctx.translate(this.pos.x, this.pos.y);
//		ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height); 
		
//		ctx.restore();
	};
	
	firstAid.eventCollision = function(collisionEvent){
		if (collisionEvent.obj1.type == "Player"){ 
			this.state = this.STATE_PICKED;
		}
	};
	
	return firstAid;
}