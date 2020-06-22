var createInputObject = function(keyDownCallback, keyUpCallback, mouseDownCallback, mouseUpCallback, mouseMoveCallback) {
    var mouseX = window.event && window.event.clientX ? window.event.clientX : 0;
    var mouseY = window.event && window.event.clientY ? window.event.clientY : 0;
	var keyPressed = {};
    for (var i = 0; i < 255; ++i) {
    	keyPressed[i] = false;
    }
    
    document.body.addEventListener('mousedown', mouseDown, false);
    document.body.addEventListener('mouseup', mouseUp, false);
    document.body.addEventListener('mousemove', mouseMove, false);
    document.body.addEventListener('keydown', keyDown, false);
    document.body.addEventListener('keyup', keyUp, false);
	
    function mouseMove(e) {
    	 e = e || event;
    	 mouseX = e.clientX;
    	 mouseY = e.clientY;
    	 if (mouseMoveCallback) {
    		 mouseMoveCallback(e.clientX, e.clientY);
    	 }
    }
    
    function mouseDown(e) {
    	e = e || event;
    	mouseDownCallback();
    }
    
    function keyDown(e) {
    	var keyCode = e.which ? e.which : e.keyCode;
    	keyPressed[keyCode] = true;
    	if (keyDownCallback) {
    		keyDownCallback(keyCode);
    	}
    };
    
    function keyUp(e) {
    	var keyCode = e.which ? e.which : e.keyCode;
    	keyPressed[keyCode] = false;
    	if (keyUpCallback) {
    		keyUpCallback(keyCode);
    	}
    };
    
    function mouseUp(e) {
    	mouseUpCallback();
    }
	
	return {
		isKeyPressed: function(key) {
			return keyPressed[key];
		},
		getMouseX: function() {
			return mouseX;
		},
		getMouseY: function() {
			return mouseY;
		}
	};
};