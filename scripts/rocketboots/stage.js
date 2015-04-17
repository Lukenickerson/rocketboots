/*
	Stage
	Stage class
	By Luke Nickerson, 2014
*/
(function(){
	var PI2 = Math.PI*2;

	var Stage = function(eltId, size){
		console.log("Stage: Creating stage", eltId, size);
		this.elementId = eltId;
		this.size = { x: size.x, y: size.y };
		this._halfSize = { x: size.x/2, y: size.y/2 };
		this.element = document.getElementById(eltId);
		//this.element.style.width	= size.x;
		//this.element.style.height	= size.y;
		this.layers = [];
		this.layerCount = 0;
		this.layerOngoingCounter = 0;
		this.camera = new this.Camera();
		
	}
	//==== Stage Functions
	Stage.prototype.addLayer = function(tagName){
		if (typeof tagName == 'undefined') tagName = "canvas";
		this.layerOngoingCounter++;
		var layer = new this.Layer(tagName, this);
		console.log(layer);
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
		this.camera.adjust();
		this.loopOverLayers(function(i, layer){
			if (layer.drawWithStage || forceAll) {
				//console.log("Stage: Drawing Layer", i);
				layer.draw();
			}
		});
	}
	Stage.prototype.resize = function(size){
		if (typeof size == 'undefined') {
			var $elt = $(this.element);
			size = {
				x : $elt.width()
				,y : $elt.height()
			};
		}
		console.log("Stage: Resize stage to", size);
		this.size.x = size.x;
		this.size.y = size.y;
		this._halfSize = { x: size.x/2, y: size.y/2 };
		this.element.style.width		= size.x + "px";
		this.element.style.height		= size.y + "px";
		this.loopOverLayers(function(i, layer){
			layer.resize(size);
		});
		this.draw();
	}
	Stage.prototype.getStageXY = function(pos){
		return {
			x:	parseInt((pos.x - this.camera.pos.x) + this._halfSize.x)
			,y: parseInt(this._halfSize.y - pos.y + this.camera.pos.y)
			//x:	(pos.x + this.camera.pos.x)
			//,y: (pos.y + this.camera.pos.y)
		};
	}
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
	Stage.prototype.Camera = function(stage){
		this.pos = {x: 0, y: 0};
		this.followCoords = null;
	}
	Stage.prototype.Camera.prototype.set = function(coords){
		this.pos.x = coords.x;
		this.pos.y = coords.y;
		this.adjust();
		return this;
	}
	Stage.prototype.Camera.prototype.follow = function(coords){
		this.followCoords = coords;
		this.adjust();
		return this;
	}
	Stage.prototype.Camera.prototype.stop = function(){
		this.adjust();
		this.followCoords = null;
		return this;
	}
	Stage.prototype.Camera.prototype.adjust = function(coords){
		if (this.followCoords != null) {
			this.pos.x = this.followCoords.x;
			this.pos.y = this.followCoords.y;
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
	}
	//==== Layer Functions
	Stage.prototype.Layer.prototype.resize = function(size)
	{
		if (typeof size == 'undefined') {
			var $elt = $(this.element);
			size = {
				x : $elt.width()
				,y : $elt.height()
			};
		}
		this.size.x = size.x;
		this.size.y = size.y;
		this.element.width		= size.x;
		this.element.height		= size.y;
	}
	Stage.prototype.Layer.prototype.connectEntities = function(ents)
	{
		//this.entitiesArray.concat(ents);
		if (typeof ents == "object") {
			this.entitiesArray.push(ents);
		} else {
			console.error("Incorrect entities. Cannot connect to layer.", ents);
		}
		return this;
	}
	Stage.prototype.Layer.prototype.draw = function()
	{
		var entCount = 0,
			ents = [],
			ent = {};
		this.ctx.clearRect(0,0,this.size.x,this.size.y);
		this.ctx.fillStyle = '#ffff66';
		this.ctx.strokeStyle = '#000000';
		this.ctx.imageSmoothingEnabled = false; // http://stackoverflow.com/questions/18547042/resizing-a-canvas-image-without-blurring-it
		this.ctx.save();
		//this.ctx.scale(this.canvasScale,this.canvasScale);
		for (var i = 0; i < this.entitiesArray.length; i++){
			ents = this.entitiesArray[i];
			entCount = ents.length;
			for (var j = 0; j < entCount; j++){
				ent = ents[j];
				if (ent != null) this.drawEntity(ent);
			}
		}
	}
	Stage.prototype.Layer.prototype.drawEntity = function(ent)
	{
		var stageXY = this.stage.getStageXY(ent.pos);
		var stageXYOffset = {
			x : stageXY.x - ent._halfSize.x + ent.stageOffset.x,
			y : stageXY.y - ent._halfSize.y + ent.stageOffset.y
		};
		//console.log("PosX", ent.pos.x, "PosY", ent.pos.y, "stageXY", stageXY, "stageXYOffset", stageXYOffset);
		//this.ctx.save();
		//this.ctx.translate(this.element.width/2, this.element.height/2);
		//this.ctx.rotate(90 *Math.PI/180);
		
		if (ent.image) {
			this.ctx.drawImage( ent.image,
				stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);
		} else {
			//this.ctx.fillStyle = '#ffff66';
			this.ctx.fillRect(stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);		
		}
		
		if (ent.isHighlighted) {
			if (typeof ent.customDraw.highlighted == 'function') {
				ent.customDraw.highlighted();
			} else {
				//this.ctx.strokeStyle = '#ff0000';
				this.ctx.strokeRect(stageXYOffset.x, stageXYOffset.y, ent.size.x, ent.size.y);
			}
		}
	
		/*
		if (typeof ent.character == 'object') {
			this.ctx.strokeStyle = ent.color;
			this.ctx.beginPath();
			this.ctx.arc(stageXY.x, stageXY.y + 10, 2, 0, PI2);
			this.ctx.stroke();	
		}
		*/
		
		//this.ctx.restore();
		
		/*
		this.ctx.strokeStyle = ent.color;
		this.ctx.beginPath();
		this.ctx.arc(stageXY.x, stageXY.y, ent.radius, 0, PI2);
		this.ctx.stroke();	
		*/
	}







	
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent("stage", "Stage", Stage);
	} else window.Stage = Stage;
})();