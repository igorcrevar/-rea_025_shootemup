

function createVec(x, y, z) {
	var v = new Object();
	
	// attributes
	v.x = x || 0;
	v.y = y || 0;
	v.z = z || 0;
	
	// functions
	v.add = function(w) {
		return createVec(this.x + w.x, this.y + w.y, this.z + w.z);
	};

	v.addToCurrent = function(w) {
		this.x += w.x;
		this.y += w.y;
		this.z += w.x;
	};
	
	v.sub = function(w) {
		return createVec(this.x - w.x, this.y - w.y, this.z - w.z);
	};
	
	v.mult = function(c) {
		return createVec(this.x * c, this.y * c, this.z * c);
	};
	
	v.mag = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	
	v.magLight = function() {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	};
	
	v.unit = function() {
		var mag = 1.0 / this.mag();
		return createVec(this.x * mag, this.y * mag, this.z * mag);
	};
	
	v.dot = function(w) {
		return (this.x * w.x + this.y * w.y + this.z * w.z);
	};
	
	v.cross = function(w) {
		var x = this.y * w.z - this.z * w.y;
		var y = this.z * w.x - this.x * w.z;
		var z = this.x * w.y - this.y * w.x;
		return createVec(x, y, z);
	};
	
	v.xAngle = function() {
		var cosA = this.x / this.mag();
		return Math.acos(cosA);
	};
	
	// "static" functions	
	/**
	 * Linear interpolation between two vectors, from v1 to v2.
	 */
	v.interpolate = function(v1, v2, weight) {
		var x = v1.x + (v2.x - v1.x) * weight;
		var y = v1.y + (v2.y - v1.y) * weight;
		var z = v1.z + (v2.z - v1.z) * weight;
		return createVec(x, y, z);
	};
	
	return v;
};

/*
function createVec(x, y, z) {
	var v = new Object();
	
	// attributes
	v.x = x || 0;
	v.y = y || 0;
	v.z = z || 0;
	
	// functions
	v.add = function(w) {
		this.x += w.x;
		this.y += w.y;
		this.z += w.z;		
		return this;
	};

	v.sub = function(w) {
		this.x -= w.x;
		this.y -= w.y;
		this.z -= w.z;		
		return this;
	};
	
	v.mult = function(c) {
		this.x *= c;
		this.y *= c;
		this.z *= c;
		return this;
	};
	
	v.mag = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	
	v.magLight = function() {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	};
	
	v.unit = function() {
		var mag = 1.0 / this.mag();
		this.x *= mag;
		this.y *= mag;
		this.z *= mag;
		return this;
	};
	
	v.dot = function(w) {
		return (this.x * w.x + this.y * w.y + this.z * w.z);
	};
	
	v.cross = function(w) {
		var x = this.y * w.z - this.z * w.y;
		var y = this.z * w.x - this.x * w.z;
		var z = this.x * w.y - this.y * w.x;
		this.x = x;
		this.y = y;
		this.z = z;		
		return this;
	};
	
	v.xAngle = function() {
		var cosA = this.x / this.mag();
		return Math.acos(cosA);
	};
	
	// "static" functions	
	v.interpolate = function(v1, v2, weight) {
		var x = v1.x + (v2.x - v1.x) * weight;
		var y = v1.y + (v2.y - v1.y) * weight;
		var z = v1.z + (v2.z - v1.z) * weight;
		return createVec(x, y, z);
	};
	
	return v;
};

 
*/
