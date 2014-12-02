/*
	Dice 
	Dice Class
	By Luke Nickerson, 2014
*/

(function(){
	var myFileName = "dice";
	var myClassName = "Dice";

	var Dice = function(){
		this.randSeed = 1;
		this.type = "random";
	}
	// NOT based on random-type
	Dice.prototype.getRandom = Math.random;
	Dice.prototype.getPseudoRandomBySeed = function(seed){
		// http://stackoverflow.com/a/19303725/1766230
		var x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	};
	Dice.prototype.getPseudoRandom = function(){
		return this.getPseudoRandomBySeed(this.randSeed++);
	};
	
	//==== Basics: "random" function returns either a 
	// true random number or a pseudorandom number based on
	// the random-type that is set.
	Dice.prototype.random = Math.random;	
	Dice.prototype.switchToPseudoRandom = function(){
		this.type = "pseudorandom";
		this.random = this.getPseudoRandom;
	}
	Dice.prototype.switchToRandom = function(){
		this.type = "random";
		this.random = Math.random;
	}
	Dice.prototype.setSeed = function(s){
		if (typeof s == "undefined") {
			s = this._normalize(Math.random(), 10000);
		}
		this.randSeed = s;
	}
	Dice.prototype._normalize = function(rand, n){
		return (Math.floor(rand * n) + 1);
	}
	
	//==== "Roll" functions
	Dice.prototype.roll1d = function (sides) {
		return this._normalize(this.random(), sides);
	}
	Dice.prototype.rollxd = function (num, sides) {
		var sum = 0;
		for (var i = 0; i < num; i++){
			sum += this.roll1d(sides);
		}
		return sum;
	}
	Dice.prototype.roll = function(){
		if (arguments.length == 1) {
			return this.roll1d(arguments[0]);
		} else if (arguments.length == 2) {
			return this.rollxd(arguments[0], arguments[1]);
		} else if (arguments.length == 3) {
			return this.rollxd(arguments[0], arguments[1]) + arguments[2];			
		} else {
			console.error("Roll needs 1, 2, or 3 arguments");
		}
	}
	
	//==== "Get" functions -- Based on random-type
	Dice.prototype.getRandomInteger = Dice.prototype.roll1d;
	Dice.prototype.getRandomIntegerBetween = function (min, max) {
		return Math.floor(this.random() * (max - min + 1) + min);
	}	
	Dice.prototype.getRandomAround = function(n){ // BELL
		var a = this.random();
		var b = this.random();
		return (n * (a-b));
	}


	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, Dice);
	} else window[myClassName] = Dice;
})();