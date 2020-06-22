function ResourceManager() {
	this.successCount = 0;
	this.errorCount = 0;
	this.cache = {};
	this.downloadQueue = [];
}

ResourceManager.prototype.load = function(files, downloadCallback, progressCallback) {
	for (var i = 0; i < files.length; ++i) {
		this.downloadQueue.push(files[i]);
	}
	
	this.__loadAll(downloadCallback, progressCallback);
};

ResourceManager.prototype.__loadAll = function(downloadCallback, progressCallback) {
	if (this.downloadQueue.length == 0) {
		downloadCallback();
	}

	var progressStepSize = 1 / this.downloadQueue.length * 100;

	for (var i=0; i<this.downloadQueue.length; ++i) {
		var path = this.downloadQueue[i];
		var img = new Image();
		var that = this;
		img.addEventListener("load", function() {
			that.successCount++;

			if (progressCallback) {
				progressCallback(that.successCount * progressStepSize);
			}
			// update progress bar
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);

		img.addEventListener("error", function() {
			that.errorCount++;
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);
		
		img.src = 'assets/images/' + path;
		var name = path.substr(0, path.indexOf('.'));
		this.cache[name] = img;
	}
};

ResourceManager.prototype.isDone = function() {
	return (this.downloadQueue.length == this.successCount + this.errorCount);
};

ResourceManager.prototype.getResource = function(name) {
	return this.cache[name];
};

ResourceManager.prototype.getResourceSrc = function(name) {
	return this.cache[name].src;
};
// -- End of Resource Manager ---------------------------------------------------

// Create instance of resource manager
var ResourceManagerObject = new ResourceManager();

// -- Audio Manager -------------------------------------------------------------
var AudioManagerObject = new function() {
	this.loadQueue = [];
	this.loadingSounds = 0;
	this.soundsCount = 0;
	this.sounds = {};
	
	var maxChannels = 10;
	audioChannels = new Array();
	for (var i=0; i<maxChannels; ++i) {
		audioChannels[i] = new Array();
		audioChannels[i]['channel'] = new Audio();
		audioChannels[i]['finished'] = -1;
	};

	this.load = function(files, callbackEnd, callbackProgress) {
		var thisRef = this;
		var audioCallback = function() { 
			thisRef.loadingSounds--;
			if (callbackProgress) {
				callbackProgress((thisRef.soundsCount - thisRef.loadingSounds) / thisRef.soundsCount * 100);
			}
			if ( thisRef.loadingSounds == 0 ) {
				callbackEnd();
			}
		};

		for (var i = 0; i < files.length; ++i) {
			var filename = files[i];
			var name = filename.substr(0, filename.indexOf('.'));
			this.soundsCount++;
			this.loadingSounds++;
			var snd = new Audio();
			this.sounds[name] = snd;
			snd.addEventListener('canplaythrough', audioCallback, false);
			snd.src = 'assets/sounds/' + filename;
			snd.load();
		}
	};

	this.play = function(snd) {
		for (var i=0; i<audioChannels.length; ++i) {
			thisTime = new Date();
			if ( audioChannels[i]['finished'] < thisTime.getTime() ) {
				audioChannels[i]['finished'] = thisTime.getTime() + this.sounds[snd].duration*1000;
				audioChannels[i]['channel'].src = this.sounds[snd].src;
				audioChannels[i]['channel'].load();
				audioChannels[i]['channel'].play();
				break;
			}
		}
	};
};
// -- End of Audio Manager ------------------------------------------------------
