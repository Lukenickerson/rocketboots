/*
	Entity
	Entity class
	By Luke Nickerson, 2014
*/
(function(){

	//=========================================================================
	//==== Entity
	
	var Entity = function(name, world, size){
		if (typeof size !== 'object') {
			size = { x: 10, y: 10 };
		}
		this.name = name;
		this.groups	= [];
		this.groupIndices = {};
		this.world 	= world;
		this.stageOffset = new this.Coords(0,0); // for minor pixel offsets
		this.pos 	= new this.Coords(0,0);
		this.vel 	= new this.Coords(0,0);
		this.mass	= 1;
		this.size 	= new this.Coords(size.x, size.y);
		this._halfSize = new this.Coords(size.x/2, size.y/2);
		this.radius = parseInt(size.x/2);
		this.image	= null;
		this.color 	= "#666";
		this.collisionShape = "circle"; // *** doesn't matter yet
		// various on/off states
		this.isHighlighted 	= false;
		this.isPhysical 	= true;
		this.isMovable		= true;
		// Custom draw functions
		this.customDraw = {
			highlighted : null
		};
		// Entity Can Contain Another
		this.tags = ["all", "physical", "movable", "physics"];
		this.contains = { 
			"all" : [],
			"physical" : [],
			"movable" : [],
			"physics" : []
		};
	}
	// Sets
	Entity.prototype.setSize = function(x,y){
		this.size.set( new this.Coords(x, y) );
		this._halfSize.set( new this.Coords(x/2, y/2) );
	}
	
	// Gets
	Entity.prototype.getType = function(){
		return this.groups[0];
	}
	Entity.prototype.isInGroup = function(group){
		return (this.groups.indexOf(group) == -1) ? false : true;
	}
	
	// Put in / take out
	
	Entity.prototype.putIn = function(ent, groups, isFront){
		if (typeof groups == "string") groups = [groups];
		if (typeof isFront != "boolean") isFront = false;
		var grp = "", groupIndex = -1;
		// Add entity to groups
		for (var t = 0; t < groups.length; t++){
			grp = groups[t];
			this.addEntityGroup(grp);
			//console.log(ent);
			if (!ent.isInGroup(grp)) {  // Is entity not in this group yet?
				groupIndex = (this.entities[grp].push(ent) - 1);
				if (isFront) {
					ent.groups = [grp].concat(ent.groups);
				} else {
					ent.groups.push(grp);
				}
				ent.groupIndices[grp] = groupIndex;
			}
		}
		return ent;
	}
	Entity.prototype.putNewIn = function(name, groups){
		var ent = new Entity(name, this, this.grid.size);
		groups = groups.concat("all");
		ent = this.putIn(ent, groups);
		this.categorizeEntitiesByGroup();
		return ent;
	}
	Entity.prototype.addEntityGroup = function(type){
		var typeId = this.entityGroups.indexOf(type);
		if (typeId == -1) {
			typeId = (this.entityGroups.push(type) - 1);
			this.entities[type] = [];
		}
		return typeId;
	}
	Entity.prototype.takeOut = function(ent, remGroups){
		//console.log("Remove groups", remGroups, typeof remGroups);
		if (typeof remGroups == "string") remGroups = [remGroups];
		else if (typeof remGroups == "undefined") remGroups = ["all"];
		// Remove "all" groups?
		if (remGroups.indexOf("all") != -1) {	
			remGroups = ent.groups.join("/").split("/");
		}
		//console.log("Remove groups", remGroups, ent.groups);
		var remGroup = "", remGroupIndex = -1;
		// Loop over groups to remove
		for (var g = 0; g < remGroups.length; g++){
			remGroup = remGroups[g];
			if (ent.isInGroup(remGroup)) {
				
				remGroupIndex = ent.groupIndices[remGroup];
				//console.log("Removing", remGroup, remGroupIndex);
				// Remove from group array
				//this.entities[remGroup].splice(remGroupIndex, 1);
				// ^ can't splice this out or all the indices get messed up
				this.entities[remGroup][remGroupIndex] = null;
				// *** ^ This might cause memory issues??
				// Remove from entity's properties
				ent.groups.splice( ent.groups.indexOf(remGroup), 1 );
				delete ent.groupIndices[remGroup];
			}
		}
		return ent;
	}

	// Bring in a pointer to the Coords class from RocketBoots
	Entity.prototype.Coords = (typeof RocketBoots.Coords == "function") ? RocketBoots.Coords : Coords;
	
	// Install as RocketBoots component
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent("entity", "Entity", Entity);
	} else window.Entity = Entity;
})();
