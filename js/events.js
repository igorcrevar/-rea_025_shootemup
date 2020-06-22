

function createCollisionEvent(obj1, obj2) {
	var e = new Object();
	
	// attributes
	e.obj1 = obj1;
	e.obj2 = obj2;
	e.type = "collision";
	
	// methods
	
	return e;	
};