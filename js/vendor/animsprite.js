/* Library for Sprite Animation handling */
/* Sprite Animation library by IC */
var Animation = function(name, imageYOffset, frames, frameWidth, frameHeight, durationEachFrame) {
	this.frames = frames;
	this.durationEachFrame = durationEachFrame;
	this.imageYOffset = imageYOffset;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.name = name;
	this.isStoped = false;
	this.frameCounter = 0;
};

Animation.prototype.setFrame = function(frame) {
	this.currentFrame = frame;
};

Animation.prototype.setDuration = function(duration) {
	this.durationEachFrame = duration;
};

//init must be called before getNextFrmae
Animation.prototype.init = function() {
	this.deltaTime = 0;
	this.currentFrame = 0;
	this.imageXOffset = 0;
	this.isStoped = false;
};

Animation.prototype.nextFrame = function() {
	if (this.isStoped) {
		return;
	}
	this.frameCounter += 1;
	if (this.frameCounter >= this.durationEachFrame) {
		//this.currentFrame = (this.currentFrame + 1) % this.frames;
		//javascript % is sloooow, javascript does not have integers :(
		if (++this.currentFrame === this.frames) {
			this.currentFrame = 0;
		}
		this.imageXOffset = this.frameWidth * this.currentFrame;
		this.frameCounter = 0;
	}
};

Animation.prototype.getXOffset = function() {
	return this.frameWidth * this.currentFrame;
};

Animation.prototype.getYOffset = function() {
	return this.imageYOffset;
};

Animation.prototype.getName = function() {
	return this.name;
};

Animation.prototype.getFrameHeight = function() {
	return this.frameHeight;
};

Animation.prototype.getFrameWidth = function() {
	return this.frameWidth;
};

//if reset is true reset to first frame
Animation.prototype.stop = function(reset) {
	this.isStoped = true;
	if (reset) {
		this.currentFrame = 0;
		this.imageXOffset = 0;
		this.frameCounter = 0;
	}
};

Animation.prototype.resume = function() {
	this.isStoped = false;
};

Animation.prototype.draw = function(context, sprite, zoom) {	
	
	var offx = this.frameWidth * zoom * 0.5;
	var offy = this.frameHeight * zoom * 0.5;
	context.drawImage(sprite, 
		              this.imageXOffset, this.imageYOffset, this.frameWidth, this.frameHeight,
					  -offx, -offy, this.frameWidth * zoom, this.frameHeight * zoom);
};

Animation.prototype.drawCSS = function(imgTag) {	
	//TODO:
};

var Sprite = function(animations, spritesheet) {
	this.zoomLevel = 1;
	
	this.setAnimations(animations);
	if (animations.length > 0) {
		this.setAnimation(animations[0]);
	}
	else {
		this.currentAnimation = null;
	}
	this.setSpritesheet(spritesheet);
};

Sprite.prototype.setSpritesheet = function(src) {
	if (src instanceof Image) {
		this.spritesheet = src;
	} else {
		this.spritesheet = new Image();
		this.spritesheet.src = src;	
	}
};

Sprite.prototype.setAnimations = function(animations) {
	var obj = new Array();
	for (var i = 0; i < animations.length; ++i) {
		var animationName = animations[i].getName();
		obj[animationName] = animations[i];
	}
	this.animations = obj;
};

Sprite.prototype.setAnimation = function(animationNameOrInstance) {
	if (typeof(animationNameOrInstance) === "string") {
		animationNameOrInstance = this.animations[animationNameOrInstance];
	}
	//change animation only if needed
	if (this.currentAnimation !== animationNameOrInstance) {
		this.currentAnimation = animationNameOrInstance;
		this.currentAnimation.init();
	}
};

Sprite.prototype.getAnimationName = function() {
	return this.currentAnimation.getName();
};

Sprite.prototype.animate = function() {
	this.currentAnimation.nextFrame();
};

Sprite.prototype.draw = function(context) {	
	this.currentAnimation.draw(context, this.spritesheet, this.zoomLevel);
};

Sprite.prototype.setZoom = function(zoomLevel) {
	this.zoomLevel = zoomLevel;
};