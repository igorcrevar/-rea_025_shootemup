
function createLevel1(controller) {
	var level = new Object();
	
	level.scrollY = 0;	
	level.draw = function() {
		var ctx = this.controller.ctx;
		var image = ResourceManagerObject.getResource('background');
		
		var sc = parseInt(this.scrollY, 10);
		ctx.drawImage(image, 0, 0,
				image.width, image.height - sc,
				0, sc,
				this.controller.width, image.height - sc);
		
		ctx.drawImage(image, 0, 0,
				image.width, image.height,
				0, -image.height + sc,
				this.controller.width, image.height);
		
		this.scrollY += 0.3;
		if (this.scrollY > image.height) {
			this.scrollY = 0;
		}				
	};	
	
	level.scrollYFor = 0;	
	level.drawForeground = function() {
		var ctx = this.controller.ctx;
		var image = ResourceManagerObject.getResource('foreground');
		
		var sc = parseInt(this.scrollYFor, 10);
		ctx.drawImage(image, 0, 0,
				image.width, image.height - sc,
				0, sc,
				this.controller.width, image.height - sc);
		
		ctx.drawImage(image, 0, 0,
				image.width, image.height,
				0, -image.height + sc,
				this.controller.width, image.height);
		
		this.scrollYFor += 2;
		if (this.scrollYFor > image.height) {
			this.scrollYFor = 0;
		}				
	};
	
	// attributes
	level.controller = controller;
	
	level.functions = [];
	level.functions[1] = function() {level.templateVirusA1();};
	level.functions[5] = function() {level.templateVirusA1();};
	level.functions[7] = function() {level.templateVirusA1();};
	level.functions[10] = function() {level.templateBacteriaA1();};
	level.functions[11] = function() {level.templateVirusB1();};
	level.functions[12] = function() {level.templateVirusB1();};
	level.functions[13] = function() {level.templateVirusB1();};
	level.functions[15] = function() {level.templateVirusA2();};
	level.functions[16] = function() {level.templateVirusA2();};
	level.functions[17] = function() {level.templateVirusA2();};
	level.functions[18] = function() {level.templateVirusA2();};
	level.functions[19] = function() {level.templateCapsule();};
	level.functions[20] = function() {level.templateVirusB2();};
	level.functions[21] = function() {level.templateVirusB2();};
	level.functions[22] = function() {level.templateVirusB2();};
	level.functions[23] = function() {level.templateBacteriaA2();};
	level.functions[24] = function() {level.templateVirusA1();};
	level.functions[25] = function() {level.templateVirusA1();};
	level.functions[26] = function() {level.templateVirusA1();};
	level.functions[27] = function() {level.templateBacteriaA2();};
	level.functions[28] = function() {level.templateBacteriaA2();};
	level.functions[32] = function() {level.templateCapsule();};
	level.functions[33] = function() {level.templateVirusB3();};
	level.functions[34] = function() {level.templateVirusB3();};
	level.functions[35] = function() {level.templateVirusB3();};
	level.functions[36] = function() {level.templateVirusB3();};
	level.functions[40] = function() {level.templateVirusA2();};
	level.functions[41] = function() {level.templateBacteriaA1();};
	level.functions[42] = function() {level.templateVirusA2();};
	level.functions[43] = function() {level.templateBacteriaA2();};
	level.functions[45] = function() {level.templateVirusA2();};
	level.functions[46] = function() {level.templateBacteriaA1();};
	level.functions[47] = function() {level.templateVirusA2();};
	level.functions[48] = function() {level.templateBacteriaA2();};
	level.functions[49] = function() {level.templateVirusA2();};
	level.functions[50] = function() {level.templateBacteriaA3();};
	level.functions[55] = function() {level.templateVirusB3();};
	level.functions[56] = function() {level.templateVirusB3();};
	level.functions[57] = function() {level.templateVirusB3();};
	level.functions[58] = function() {level.templateVirusB3();};
	level.functions[59] = function() {level.templateVirusB3();};
	level.functions[62] = function() {level.templateBacteriaA3();};
	level.functions[64] = function() {level.templateBacteriaA3();};
	level.functions[70] = function() {level.templateBacteriaA3();};
	level.functions[72] = function() {level.templateBacteriaA3();};
	level.functions[74] = function() {level.templateBacteriaA3();};
	level.functions[76] = function() {level.templateVirusA3();};
	level.functions[78] = function() {level.templateVirusA3();};
	level.functions[80] = function() {level.templateVirusA3();};
	level.functions[81] = function() {level.templateCapsule();};
	level.functions[82] = function() {level.templateVirusA3();};
	level.functions[84] = function() {level.templateVirusA3();};
	level.functions[86] = function() {level.templateCapsule();};
	level.functions[95] = function() {level.templateBacteriaA3();};
	level.functions[96] = function() {level.templateVirusA3();};
	level.functions[97] = function() {level.templateBacteriaA3();};
	level.functions[98] = function() {level.templateVirusA3();};
	level.functions[99] = function() {level.templateBacteriaA3();};
	level.functions[100] = function() {level.templateVirusA3();};
	level.functions[101] = function() {level.templateVirusA3();};
	level.functions[102] = function() {level.templateBacteriaA3();};
	level.functions[103] = function() {level.templateBacteriaA1();};
	level.functions[104] = function() {level.templateCapsule();};
	level.functions[105] = function() {level.templateCapsule();};
	level.functions[120] = function() {level.templateQueen1();};
	
	// methods
	level.update = function() {
		var time = this.controller.time;
		
		if (time % 60 == 0 && this.functions[time / 60]) {
			this.functions[time / 60]();
		}
	};
	
	level.templateVirusA1 = function() {
		var virusA = createVirusA(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 3.0, createVec(0, 1),
				100);
		this.controller.addEnemy(virusA);			
	};
	
	level.templateVirusA2 = function() {
		var virusA = createVirusA(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 4.0, createVec(0, 1),
				200);
		this.controller.addEnemy(virusA);			
	};
	
	level.templateVirusA3 = function() {
		var virusA = createVirusA(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 5.0, createVec(0, 1),
				300);
		this.controller.addEnemy(virusA);			
	};
	
	level.templateVirusB1 = function() {
		var virusA = createVirusB(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 3.0, createVec(0, 1),
				100);
		this.controller.addEnemy(virusA);			
	};
	
	level.templateVirusB2 = function() {
		var virusA = createVirusB(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 4.0, createVec(0, 1),
				200);
		this.controller.addEnemy(virusA);			
	};
	
	level.templateVirusB3 = function() {
		var virusA = createVirusB(this.controller, createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 5.0, createVec(0, 1),
				300);
		this.controller.addEnemy(virusA);			
	};

	level.templateBacteriaA1 = function() {
		var x = (Math.random() * this.controller.width) * 0.7 + 0.15;
		var bacteriaA = createBacteriaA(this.controller, createVec(x, -10), 
				createVec(0, 1), 2.0, createVec(0, 1), 15.0, 
				100, 
				Math.random() * 100 + 100, 
				50, 8, 50, 
				10, 500);
		this.controller.addEnemy(bacteriaA);		
	};
	
	level.templateBacteriaA2 = function() {
		var x = (Math.random() * this.controller.width) * 0.7 + 0.15;
		var bacteriaA = createBacteriaA(this.controller, createVec(x, -10), 
				createVec(0, 1), 2.5, createVec(0, 1), 15.0, 
				150, 
				Math.random() * 100 + 200, 
				40, 8, 60, 
				15, 700);
		this.controller.addEnemy(bacteriaA);		
	};
	
	level.templateBacteriaA3 = function() {
		var x = (Math.random() * this.controller.width) * 0.7 + 0.15;
		var bacteriaA = createBacteriaA(this.controller, createVec(x, -10), 
				createVec(0, 1), 2.5, createVec(0, 1), 15.0, 
				200, 
				Math.random() * 100 + 300, 
				30, 8, 80, 
				20, 1000);
		this.controller.addEnemy(bacteriaA);			
	};
	
	level.templateCapsule = function() {
		//direction, speed, orient, health, sporeNumber
		var bacteriaA = createCapsule(
				this.controller, 
				createVec(Math.random() * this.controller.width, -10), 
				createVec(0, 1), 
				2.0, 
				createVec(0, 1), 
				15.0,
				15
				);
		this.controller.addEnemy(bacteriaA);
	};
	
	level.templateQueen1 = function() {
		var queen = createQueen(this.controller);
		this.controller.addEnemy(queen);			
	};
	
	return level;
};


function createLevel2(controller) {
	var level = new Object();
	
	// attributes
	level.controller = controller;
	
	level.functions = [];
	level.functions[1] = function() {level.templateQueen1();};
	
	// methods
	level.update = function() {
		var time = this.controller.time;
		
		if (time % 60 == 0 && this.functions[time / 60]) {
			this.functions[time / 60]();
		}
	};
	
	level.templateQueen1 = function() {
		var queen = createQueen(this.controller);
		this.controller.addEnemy(queen);			
	};
	
	return level;
};