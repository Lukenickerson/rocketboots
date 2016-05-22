(function(){
	var component = {
		fileName: 		"Game",
		classNames:		["Game"],
		requirements:	[],
		description:	"Game Class for RocketBoots",
		credits:		"By Luke Nickerson, 2016"
	};

	function Game (options) {
		if (typeof options === 'string') {
			options = {name: options};
		} else {
			options = options || {};
		}
		this.name = options.name || "Game made with RocketBoots";
		
		this.init(options);
	}
	component.Game = Game;

	//======================================================= Game Functions ======

	Game.prototype.init = function(options){
		//console.log("Initializing Game");
		var g = this;

		g._addDefaultComponents(options);
		if (typeof options.instantiateComponents === 'object') {
			g.instantiateComponents(options.instantiateComponents);
		}
		//g._addStages(options.stages);
		g._addDefaultStates();
		g._setupTransitionLinks();
		g.state.start("boot");
		return this;
	}

	Game.prototype.instantiateComponents = function (components) {
		var i, key, compClass;
		for (i = 0; i < components.length; i++) {
			
			for (key in components[i]) {
				compClass = components[i][key];
				console.log("Instantiating component class", compClass, "as", key);
				this._addComponent(key, compClass);
			}
		}
		return this;
	}

	Game.prototype._addDefaultComponents = function(options){
		this._addComponent("state", "StateMachine")	
			//._addComponent("sounds", "SoundCannon")
			//._addComponent("images", "ImageOverseer")
			//._addComponent("state", "StateMachine")	
			//._addComponent("looper", "Looper")
			//._addComponent("timeCount", "TimeCount")
			//._addComponent("incrementer", "Incrementer")
			//._addComponent("dice", "Dice")
			//._addComponent("keyboard", "Keyboard")
			//._addComponent("physics", "Physics")
			//._addComponent("entity", "Entity")
			//._addComponent("world", "World", options.world);
			// *** stage?
		return this;
	};

	Game.prototype._addComponent = function(gameCompName, componentClass, arg){
		if (RocketBoots.hasComponent(componentClass)) {
			//console.log("RB adding component", gameCompName, "to the game using class", componentClass, "and arguments:", arg);
			this[gameCompName] = new RocketBoots[componentClass](arg);
		} else {
			//console.warn(componentClass, "not found as a RocketBoots component");
		}
		return this;
	};

	Game.prototype._addDefaultStates = function () {
		var g = this;
		// Setup default states (mostly menu controls)
		var startMenu = function(){ 
			//$('header, footer').show();
		};
		var endMenu = function(){
			//$('header, footer').hide();
		}
		g.state.addStates({
			"boot": { 		autoView: true, start: startMenu, end: endMenu },
			"preload": { 	autoView: true, start: startMenu, end: endMenu },
			/*
			"mainmenu": { 	autoView: true, start: startMenu, end: endMenu },
			"new": { 		autoView: true, start: startMenu, end: endMenu },
			"save": { 		autoView: true, start: startMenu, end: endMenu },
			"load": { 		autoView: true, start: startMenu, end: endMenu },
			"help": { 		autoView: true, start: startMenu, end: endMenu },
			"settings": { 	autoView: true, start: startMenu, end: endMenu },
			"credits": { 	autoView: true, start: startMenu, end: endMenu },
			"share": { 		autoView: true, start: startMenu, end: endMenu },
			*/
			"game": {}
		});
		/*
		g.state.add("game",{
			start : function(){
				$('header, footer').hide();
				this.$view.show();
			}, end : function(){
				$('header, footer').show();
				this.$view.hide();
			}
		});
		*/
		
		//g.state.get("game").$view.show();

		return g;
	};

	Game.prototype._setupTransitionLinks = function () {
		var g = this;
		// Setup state transition clicks
		$('.goto').click(function(){
			var stateName = $(this).data("state");
			g.state.transition(stateName);
		});
		return g;
	};


	Game.prototype._addStages = function (stageData) {
		var g = this;
		g.stages = g.stages || [];
		stageData = stageData || [];
		// If the stage data exists and the element exists, then convert into real stages...
		if (typeof RocketBoots.Stage === "function" && stageData.length > 0) {
			$.each(stageData, function(i, iStageData){
				if ($('#' + iStageData.id).length > 0) {
					g.stages[i] = new RocketBoots.Stage(iStageData.id, iStageData.size);
				}
			});
			g.stage = g.stages[0];
		}
		return g;
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