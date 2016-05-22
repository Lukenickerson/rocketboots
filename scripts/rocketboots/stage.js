(function(){
	var component = {
		fileName: 		"Stage",
		classNames:		["Stage"],
		requirements:	[],
		description:	"",
		credits:		"By Luke Nickerson, 2014"
	};
	//var PI2 = Math.PI*2;

	var Stage = component.Stage = function(eltId, size){
		console.log("Stage: Creating stage", eltId, size);
		this.elementId = eltId;
		this.size = { x: size.x, y: size.y };
		this._halfSize = { x: size.x/2, y: size.y/2 };
		this.scale = {x: 10, y: 10};
		this.element = document.getElementById(eltId);
		//this.element.style.width	= size.x;
		//this.element.style.height	= size.y;
		this.layers = [];
		this.layerCount = 0;
		this.layerOngoingCounter = 0;
		this.camera = new this.Camera({stage: this});
		this.smoothImage = false;
		
	}
	//==== Stage Functions
	Stage.prototype.addLayer = function(tagName){
		if (typeof tagName == 'undefined') tagName = "canvas";
		this.layerOngoingCounter++;
		var layer = new this.Layer(tagName, this);
		//console.log(layer);
		this.element.appendChild(layer.element);
		this.layers.push(layer);
		this.layerCount++;
		return layer;
	}
	Stage.prototype.removeLayer = function(){
		this.layerCount--;
	}
	Stage.prototype.loopOverLayers = function(fn){
		for (var i = 0; i < this.layerCount; i++){
			fn(i, this.layers[i]);
		}		
	}
	Stage.prototype.draw = function(forceAll){
		if (typeof forceAll != "boolean") forceAll = false;
		this.camera.focus();
		this.loopOverLayers(function(i, layer){
			if (layer.drawWithStage || forceAll) {
				//console.log("Stage: Drawing Layer", i);
				layer.draw();
			}
		});
	}
	Stage.prototype.resize = function(size){
		var o = this;
		if (typeof size == 'undefined') {
			var $elt = $(this.element);
			size = {
				x : $elt.width()
				,y : $elt.height()
			};
		}
		console.log("Stage: Resize stage to", size, "with scaling", o.scale);
		o.size.x = size.x;
		o.size.y = size.y;
		o._halfSize = { x: size.x/2, y: size.y/2 };
		o.element.style.width		= (size.x * o.scale.x) + "px";
		o.element.style.height		= (size.y * o.scale.y) + "px";
		o.loopOverLayers(function(i, layer){
			layer.resize(size);
		});
		o.draw();
	}
	Stage.prototype.getStageXY = function(pos){
		return {x:	this.getStageX(pos.x), y: this.getStageY(pos.y)};
	};
	Stage.prototype.getStageX = function (x) {
		//if (typeof this.camera === 'undefined') return null;
		return parseInt(((x - this.camera.pos.x) + this._halfSize.x) * 1); //this.scale.x)
	};
	Stage.prototype.getStageY = function (y) {
		//if (typeof this.camera === 'undefined') return null;
		return parseInt((this._halfSize.y - y + this.camera.pos.y) * 1); //this.scale.y)
	};
	Stage.prototype.getPosition = function(stageX, stageY){
		return {
			x:	stageX + this.camera.pos.x - this._halfSize.x
			,y: this.camera.pos.y + this._halfSize.y - stageY
			//x:	(this.camera.pos.x - stageX)
			//,y: (this.camera.pos.y - stageY)
		};		
	}
	Stage.prototype.addClickEvent = function(fn){
		var s = this;
		$(this.element).click(function(e){
			//console.log("Clicked stage", e.offsetX, e.offsetY);
			fn(s.getPosition(e.offsetX, e.offsetY), e);
		});
	}

	
	//==== CAMERA
	Stage.prototype.Camera = function(options){
		this.pos = {x: 0, y: 0};
		this.followCoords = null;
		this.lockedX = null;
		this.lockedY = null;
		this.stage = options.stage || null;
	}
	Stage.prototype.Camera.prototype.set = function(coords){
		this.pos.x = coords.x;
		this.pos.y = coords.y;
		this.focus();
		return this;
	}
	Stage.prototype.Camera.prototype.follow = function(coords){
		this.followCoords = coords;
		this.focus();
		return this;
	}
	Stage.prototype.Camera.prototype.stop = function(){
		this.focus();
		this.followCoords = null;
		this.unlock();
		return this;
	}
	Stage.prototype.Camera.prototype.lockX = function (x) {
		this.lockedX = x;
		return this;
	}
	Stage.prototype.Camera.prototype.lockY = function (y) {
		this.lockedY = y;
		return this;
	}	
	Stage.prototype.Camera.prototype.unlock = function () {
		this.lockedX = null;
		this.lockedY = null;
		return this;
	}
	Stage.prototype.Camera.prototype.focus = function(coords){
		if (this.followCoords != null) {
			this.pos.x = (typeof this.lockedX === 'number') ? this.lockedX : this.followCoords.x;
			this.pos.y = (typeof this.lockedY === 'number') ? this.lockedY : this.followCoords.y;
		}
		return this;
	}	
	


	//==== LAYER
	Stage.prototype.Layer = function(tagName, stage){
		this.tagName = tagName;
		this.stage = stage;
		this.element = document.createElement(tagName);
		this.elementId = stage.elementId + "-" + stage.layerOngoingCounter;
		// Set some values for the newly created layer element
		this.element.id 		= this.elementId;
		this.element.className 	= "layer";
		this.element.width		= stage.size.x;
		this.element.height		= stage.size.y;
		this.drawWithStage 		= true;
		this.size = { x: stage.size.x, y: stage.size.y };
		this.ctx = (tagName == "canvas") ? this.element.getContext('2d') : null;
		this.entitiesArray = [];
		this.stageGridScale = 0;
		this.worldGridScale = 0;
	}
	//==== Layer Functions
	Stage.prototype.Layer.prototype.resize = function(size) {
		var lay = this;
		if (typeof size == 'undefined') {
			var $elt = $(this.element);
			size = {
				x : $elt.width()
				,y : $elt.height()
			};
		}
		lay.size.x = size.x;
		lay.size.y = size.y;
		lay.element.style.width		= size.x * lay.stage.scale.x;
		lay.element.style.height	= size.y * lay.stage.scale.y;
		lay.element.width			= size.x;
		lay.element.height			= size.y;
	};

	Stage.prototype.Layer.prototype.connectEntities = function(ents) {
		this.entitiesArray = ents;
	};
	Stage.prototype.Layer.prototype.addEntities = function(ents) {
		var lay = this;
		//this.entitiesArray.concat(ents);
		if (ents instanceof Array) {
			$.each(ents, function(i, ent){
				lay.entitiesArray.push(ents);
			});
		} else if (typeof ents === "object") {
			lay.entitiesArray.push(ents);
		} else {
			console.error("Incorrect entities. Cannot connect to layer.", ents);
		}
		return this;
	};

	Stage.prototype.Layer.prototype.draw = function() {
		var o = this,
			ctx = o.ctx,
			entCount = 0,
			ents = [],
			ent = {},
			i, j;
		ctx.save();
		ctx.clearRect(0, 0, o.size.x, o.size.y);
		ctx.restore();
		ctx.fillStyle = '#ffff66';
		ctx.strokeStyle = '#000000';
		ctx.imageSmoothingEnabled = o.smoothImage; // http://stackoverflow.com/questions/18547042/resizing-a-canvas-image-without-blurring-it
		//ctx.webkitImageSmoothingEnabled = o.smoothImage;
		ctx.mozImageSmoothingEnabled = o.smoothImage;
		ctx.oImageSmoothingEnabled = o.smoothImage;

		//ctx.save(); // TODO: needed?
		//ctx.scale(2, 2);

		// Loop over entities and draw them
		entCount = o.entitiesArray.length;
		for (i = 0; i < entCount; i++){
			ent = o.entitiesArray[i];
			if (ent !== null) {
				//console.log(ent);
				o.drawEntity(ent);
			}
			/*
			entCount = ents.length;
			for (j = 0; j < entCount; j++){
				ent = ents[j];
				if (ent != null) this.drawEntity(ent);
			}
			*/
		}

		//ctx.restore(); // TODO: needed?
		// Draw a grid
		o.drawGrid(20);
	};

	Stage.prototype.Layer.prototype.drawEntity = function(ent) {
		if (!ent.isVisible) {
			return false;
		}
		var ctx = this.ctx;
		var stageXY = this.stage.getStageXY(ent.pos);
		var stageXYOffset = {
			x : stageXY.x - ent._halfSize.x + ent.stageOffset.x,
			y : stageXY.y - ent._halfSize.y + ent.stageOffset.y
		};
		ctx.layer = this; // TODO: better way to do this?
		//console.log("PosX", ent.pos.x, "PosY", ent.pos.y, "stageXY", stageXY, "stageXYOffset", stageXYOffset);
		
		//ctx.save(); // TODO: needed?
		//ctx.translate(this.element.width/2, this.element.height/2);
		//ctx.rotate(90 *Math.PI/180);
		
		if (typeof ent.draw.before === 'function') {
			ent.draw.before(ctx, stageXY, stageXYOffset);
		}

		if (typeof ent.draw.custom === 'function') {
			ent.draw.custom(ctx, stageXY, stageXYOffset);	
		} else {
			if (ent.image) {
				ctx.drawImage( ent.image,
					stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);
			} else {
				ctx.fillStyle = ent.color; // '#ffff66';
				ctx.fillRect(stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);		
			}
		}
		
		if (ent.isHighlighted) {
			if (typeof ent.draw.highlight == 'function') {
				ent.draw.highlight();
			} else {
				//ctx.strokeStyle = '#ff0000';
				ctx.strokeRect(stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);
			}
		}

		if (typeof ent.draw.after === 'function') {
			ent.draw.after(ctx, stageXY, stageXYOffset);
		}
	
		/*
		if (typeof ent.character == 'object') {
			ctx.strokeStyle = ent.color;
			ctx.beginPath();
			ctx.arc(stageXY.x, stageXY.y + 10, 2, 0, PI2);
			ctx.stroke();	
		}
		*/
		
		//ctx.restore(); // TODO: needed?
		
		/*
		ctx.strokeStyle = ent.color;
		ctx.beginPath();
		ctx.arc(stageXY.x, stageXY.y, ent.radius, 0, PI2);
		ctx.stroke();	
		*/
	};

	Stage.prototype.Layer.prototype.drawStageLine = function (x1, y1, x2, y2, lineWidth, color) {
		var ctx = this.ctx;
		if (lineWidth) { ctx.lineWidth = lineWidth; }
		if (color) { ctx.strokeStyle = color; }
		if (lineWidth == 1) {
			y1 += 0.5;
			y2 += 0.5;
		}
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		//console.log(arguments);
		return this;
	}

	Stage.prototype.Layer.prototype.drawGrid = function() {
		var lay = this, 
			ctx = this.ctx,
			getStageX = this.stage.getStageX,
			getStageY = this.stage.getStageY,
			lineStart, lineEnd;
		
		if (lay.stageGridScale > 0) {
			//==== Stage Grid
			ctx.strokeStyle = 'rgba(255,255,0,0.25)'; //#ffff00';
			ctx.beginPath();
			for (i = 0; i < lay.size.x; i+=lay.stageGridScale) {
				ctx.moveTo(i, 0);
				ctx.lineTo(i, lay.size.y);
				//ctx.strokeRect(i, 0, i, lay.size.y);
			}
			for (i = 0; i < lay.size.y; i+=lay.stageGridScale) {
				ctx.moveTo(0, i);
				ctx.lineTo(lay.size.x, i);
				//ctx.strokeRect(0, i, lay.size.x, i);
			}
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		
		if (lay.worldGridScale > 0) {
			//==== World Grid
			var max = (lay.worldGridScale * 100);
			var min = (-1 * max);
			
			// *** TODO: Fix so it doesn't draw on half pixels 
			// http://stackoverflow.com/questions/13879322/drawing-a-1px-thick-line-in-canvas-creates-a-2px-thick-line

			ctx.strokeStyle = 'rgba(0,100,255,0.5)';
			ctx.beginPath();
			for (i = min; i < max; i+=lay.worldGridScale) {
				lineStart = lay.stage.getStageXY({x: i, y: min});
				lineEnd = lay.stage.getStageXY({x: i, y: max});
				ctx.moveTo(lineStart.x, lineStart.y);
				ctx.lineTo(lineEnd.x, lineEnd.y);
			}
			for (i = min; i < max; i+=lay.worldGridScale) {
				lineStart = lay.stage.getStageXY({x: min, y: i});
				lineEnd = lay.stage.getStageXY({x: max, y: i});
				ctx.moveTo(lineStart.x, lineStart.y);
				ctx.lineTo(lineEnd.x, lineEnd.y);
			}
			ctx.lineWidth = 1;
			ctx.stroke();
		}

	};




	// Install into RocketBoots if it exists
	if (typeof RocketBoots === "object") {
		RocketBoots.installComponent(component);
	} else { // Otherwise put the classes on the global window object
		for (var i = 0; i < component.classNames.length; i++) {
			window[component.classNames[i]] = component[component.classNames[i]];
		}
	}
})();