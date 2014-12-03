/*
	World
	World class
	By Luke Nickerson, 2014
*/
(function(){

	if (typeof RocketBoots.Coords == "function") {
		var Coords = RocketBoots.Coords;
	} else if (typeof Coords == "function") {
		var Coords = Coords;
	} else {
		var Coords = function(x,y){
			this.x = x;
			this.y = y;
		}
	}


	var World = function(){
		this.dimensions = 2;
		this.min = { x: -300, y: -300};
		this.max = { x: 300, y: 300};
		this.entities = [];
	}
	
	World.prototype.getRandomPosition = function(dice){
		if (typeof dice == "undefined") {
			var dice = new RocketBoots.Dice();
		}
		var x = dice.getRandomIntegerBetween(this.min.x, this.max.x);
		var y = dice.getRandomIntegerBetween(this.min.y, this.max.y);
		var pos = new Coords(x,y);
		return pos;
	}
	
	World.prototype.keepCoordsInRange = function(coords){
		var wasOutOfRange = false;
		if (coords.x < this.min.x) {
			coords.x = this.min.x;
			wasOutOfRange = true;
		} else if (coords.x > this.max.x) {
			coords.x = this.max.x;
			wasOutOfRange = true;
		}
		if (coords.y < this.min.y) {
			coords.y = this.min.y;
			wasOutOfRange = true;
		} else if (coords.y > this.max.y) {
			coords.y = this.max.y;
			wasOutOfRange = true;
		}
		return wasOutOfRange;
	}
	
	World.prototype.addEntity = function(){
		var ent = new this.Entity(this);
		this.entities.push(ent);
			
		// *** remove this
		ent.pos.set( this.getRandomPosition() );
		
	}
	
	World.prototype.Entity = function(world){
		this.world = world;
		this.pos = new Coords(0,0);
		this.vel = new Coords(0,0);
		this.size = new Coords(10,10);
		this._halfSize = new Coords(5,5);
	}

	
	
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent("world", "World", World);
	} else window.World = World;
})();