
function createGameController(ctx, width, height, inputObject, levelNumber) {
	var ctrl = new Object();
	
	levelNumber = levelNumber || 1;
	//game states!!!
	ctrl.STATE_INTRO = 'INTRO';
	ctrl.STATE_GAME = 'GAME';
	ctrl.STATE_GAMEOVER = 'GAMEOVER';
	ctrl.STATE_GAMEEND = 'GAMEEND';
	
	ctrl.init = function(level) { 
		this.player = createPlayer(this, inputObject, createVec(256, 700), createVec(0, 1), 0.5, createVec(0, 1), 30.0, 500);
		switch(level) {
		default:
			ctrl.level = createLevel1(this);
			break;
		}
		
		this.time = 0;
		
		this.enemies = [];
		this.playerBullets = [];
		this.enemyBullets = [];
		this.effects = [];
		this.items = [];
		this.state = ctrl.STATE_GAME;
		this.backgroundSprites = [];
		
		this.deadQueens = 0;
	};
	
	//init level 
	ctrl.init(levelNumber);	
	
	// attributes
	ctrl.ctx = ctx;
	ctrl.width = width || 100;
	ctrl.height = height || 100;
	
	// methods
	ctrl.addEnemy = function(enemy) {
		this.enemies.push(enemy);
	};

	ctrl.removeEnemy = function(enemy){
		for(var i = 0; i < this.enemies.length; i++){
			if(enemy == this.enemies[i]){
				break;
			}
		}
		this.enemies.splice(i, 1);
	};
	
	ctrl.addPlayerBullet = function(bullet) {
		this.playerBullets.push(bullet);
	};

	ctrl.removePlayerBullet = function(bullet){
		for(var i=0; i < this.playerBullets.length; i++){
			if(bullet == this.playerBullets[i]){
				break;
			}
		}
		this.playerBullets.splice(i, 1);
	};
	
	ctrl.addEnemyBullet = function(bullet) {
		this.enemyBullets.push(bullet);
	};
	
	ctrl.removeEnemyBullet = function(bullet){
		for(var i = 0; i < this.enemyBullets.length; i++){
			if(bullet == this.enemyBullets[i]){
				break;
			}
		}
		this.enemyBullets.splice(i,1);
	};
	
	ctrl.removeBackgroundSprite = function(sprite) {
		for(var i = 0; i < this.backgroundSprites.length; i++){
			if(sprite == this.backgroundSprites[i]){
				break;
			}
		}
		this.backgroundSprites.splice(i,1);
	};
	
	ctrl.addBackgroundSprite = function(sprite) {
		this.backgroundSprites.push(sprite);
	};
	
	ctrl.addEffect = function(effect) {
		this.effects.push(effect);
	};
	
	ctrl.removeEffect = function(effect){
		for(var i = 0; i < this.effects.length; i++){
			if(effect == this.effects[i]){
				break;
			}
		}
		this.effects.splice(i, 1);
	};
	
	ctrl.addItem = function(item) {
		this.items.push(item);
	};

	ctrl.removeItem = function(item){
		for(var i = 0; i < this.items.length; i++){
			if(item == this.items[i]){
				break;
			}
		}
		this.items.splice(i, 1);
	};
	
	ctrl.update = function() {
		if (this.state == this.STATE_GAMEOVER) {
			if (inputObject.isKeyPressed(32)) {
				document.getElementById('gameover').style.display = 'none';
				this.state = this.STATE_GAME;
				this.init(levelNumber);
			}
			
			return;
		}
		else if (this.state == this.STATE_GAMEND) {
			if (inputObject.isKeyPressed(32)) {
				this.state = this.STATE_GAME;
				this.init(levelNumber);
			}
		
			return;
		}
		
		this.time++;
		
		//harcoded corpuscles
		if (this.time % 160 == 0) {
			createCorpuscle(this);
		}
		
		this.level.update();
		
		// update player
		this.player.update();
		
		// update background sprites
		for (var i = 0; i < this.backgroundSprites.length; i++) {
			ctrl.backgroundSprites[i].update();
		}
		
		// update enemies
		for (var i = 0; i < this.enemies.length; i++) {
			ctrl.enemies[i].update();
		}
		
		// update player bullets
		for (var i = 0; i < this.playerBullets.length; i++) {
			ctrl.playerBullets[i].update();
		}
		
		// update enemy bullets
		for (var i = 0; i < this.enemyBullets.length; i++) {
			ctrl.enemyBullets[i].update();
		}
		
		// update effects
		for (var i = 0; i < this.effects.length; i++) {
			ctrl.effects[i].update();
		}
		
		// update items
		for (var i = 0; i < this.items.length; i++) {
			ctrl.items[i].update();
		}
		
		this.checkCollisions();
	};
	
	ctrl.draw = function() {
		this.level.draw();
		if (ctrl.state == ctrl.STATE_GAMEOVER) {
			  document.getElementById('gameover').style.display = 'block';		      
		      return;
		}
		else if (this.state == this.STATE_GAMEND) {
			  this.ctx.font = "normal 18px Verdana";
		      this.ctx.fillStyle = "#FFFFFF";
		      var txt = "Mission accomplish!!!"; 
		      var textWidth =  this.ctx.measureText(txt).width;
		      this.ctx.fillText(txt, (this.width - textWidth) / 2, 300);		      
		      return;
		}
		
		// draw background sprites
		for (var i = 0; i < this.backgroundSprites.length; i++) {
			ctrl.backgroundSprites[i].draw(this.ctx);
		}
		
		// draw player
		this.player.draw(this.ctx);
		
		// draw enemies
		for (var i = 0; i < this.enemies.length; i++) {
			ctrl.enemies[i].draw(this.ctx);
		}
		
		// draw player bullets
		for (var i = 0; i < this.playerBullets.length; i++) {
			ctrl.playerBullets[i].draw(this.ctx);
		}
		
		// draw enemy bullets
		for (var i = 0; i < this.enemyBullets.length; i++) {
			ctrl.enemyBullets[i].draw(this.ctx);
		}
		
		// draw effects
		for (var i = 0; i < this.effects.length; i++) {
			ctrl.effects[i].draw(this.ctx);
		}
		
		// draw items
		for (var i = 0; i < this.items.length; i++) {
			ctrl.items[i].draw(this.ctx);
		}
		
		//draw foreground
		this.level.drawForeground();
	};
	
	ctrl._isColided = function(obj1, obj2) {
		if (obj1 && obj2) {
			var fastObj = obj1;
			var slowObj = obj2;
			if (obj2.speed > obj1.speed) {
				fastObj = obj2;
				fastObj = obj1;
			}
			var iterations = fastObj.speed / fastObj.boundRadius;
			var fastPos = fastObj.pos;
			var radius = obj1.boundRadius + obj2.boundRadius;
			var fastSpeed = fastObj.boundRadius;
			for (var i = 0; i < iterations; i++) {
				var distance = fastPos.sub(slowObj.pos).mag();
				if (distance < radius) {
					return true;
				}			
				fastPos = fastPos.add(fastObj.direction.mult(fastSpeed));
			}
		}
		return false;
	};
	
	ctrl.checkCollisions = function() {		
		// check player vs enemy
		for (var i = 0; i < this.enemies.length; i++) {
			if (this._isColided(this.player, this.enemies[i])) {
				var collisionEvent = createCollisionEvent(this.player, this.enemies[i]);
				this.player.eventCollision(collisionEvent);
				this.enemies[i].eventCollision(collisionEvent);
			}
		}
		
		// check player vs enemy bullet
		for (var i = 0; i < this.enemyBullets.length; i++) {
			if (this._isColided(this.player, this.enemyBullets[i])) {
				var collisionEvent = createCollisionEvent(this.player, this.enemyBullets[i]);
				this.player.eventCollision(collisionEvent);
				this.enemyBullets[i].eventCollision(collisionEvent);
			}
		}		

		// check player vs item
		for (var i = 0; i < this.items.length; i++) {
			if (this._isColided(this.player, this.items[i])) {
				var collisionEvent = createCollisionEvent(this.player, this.items[i]);
				this.player.eventCollision(collisionEvent);
				this.items[i].eventCollision(collisionEvent);
			}
		}		
		
		// check enemy vs player bullet
		for (var i = 0; i < this.playerBullets.length; i++) {
			for (var j = 0; j < this.enemies.length; j++) {
				if (this._isColided(this.playerBullets[i], this.enemies[j])) {
					var collisionEvent = createCollisionEvent(this.playerBullets[i], this.enemies[j]);
					this.playerBullets[i].eventCollision(collisionEvent);
					this.enemies[j].eventCollision(collisionEvent);
				}
			}
		}
	};
	
	
	return ctrl;
}

