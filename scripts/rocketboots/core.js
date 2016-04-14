var RocketBoots = {
	isInitialized : false,
	readyFunctions : [],
	components : {},
	
	//==== Classes
	Component : function(c){
		this.fileName = c;
		this.name = null;
		this.isLoaded = false;
		this.isInstalled = false;	
	},
	Game : function(gn){
		this.name = gn || "Game made with RocketBoots";
		
		
		this.init();
	},
	
	//==== Functions
	addComponentsToGame : function(gameObj){
		var o = this;
		o.addComponentToGame(gameObj, "sounds", "SoundCannon");
		o.addComponentToGame(gameObj, "images", "ImageOverseer");
		o.addComponentToGame(gameObj, "state", "StateMachine");	
		o.addComponentToGame(gameObj, "looper", "Looper");
		o.addComponentToGame(gameObj, "timeCount", "TimeCount");
		o.addComponentToGame(gameObj, "incrementer", "Incrementer");
		o.addComponentToGame(gameObj, "dice", "Dice");
		o.addComponentToGame(gameObj, "physics", "Physics");
		o.addComponentToGame(gameObj, "entity", "Entity");
		o.addComponentToGame(gameObj, "world", "World");
		// If game-stage exists, then add it to the game, otherwise don't.
		if ($('#game-stage').length > 0) {
			//o.addComponentToGame(gameObj, "stage", "Stage", "game-stage");
			if (typeof RocketBoots.Stage == "function") {
				gameObj.stage = new RocketBoots.Stage("game-stage", {x: 400, y: 400});
			}
			
		}
		// Setup default states (mostly menu controls)
		var startMenu = function(){ 
			$('header, footer').show();
			this.$view.show();
		};
		var endMenu = function(){
			$('header, footer').hide();
			this.$view.hide();
		}
		gameObj.state
			.add("boot", 	{ start: startMenu, end: endMenu })
			.add("preload", { start: startMenu, end: endMenu })
			.add("mainmenu", { start: startMenu, end: endMenu })
			.add("new", 	{ start: startMenu, end: endMenu })
			.add("save", 	{ start: startMenu, end: endMenu })
			.add("load", 	{ start: startMenu, end: endMenu })
			.add("help", 	{ start: startMenu, end: endMenu })
			.add("settings", { start: startMenu, end: endMenu })
			.add("credits", { start: startMenu, end: endMenu })
			.add("share", 	{ start: startMenu, end: endMenu })
			.add("game")
		;
		/*
		gameObj.state.add("game",{
			start : function(){
				$('header, footer').hide();
				this.$view.show();
			}, end : function(){
				$('header, footer').show();
				this.$view.hide();
			}
		});
		*/
		gameObj.state.start("boot");
		//gameObj.state.get("game").$view.show();
		
		// Setup state transition clicks
		$('.goto').click(function(){
			var stateName = $(this).data("state");
			gameObj.state.transition(stateName);
		});
		
	},
	addComponentToGame : function(gameObj, gameCompName, componentClass, arg){
		if (typeof RocketBoots[componentClass] == "function") {
			//console.log("Adding " + gameCompName);
			gameObj[gameCompName] = new RocketBoots[componentClass](arg);
		}
	},
	loadScript : function(url, callback){
		//console.log("Loading script", url);
		// http://stackoverflow.com/a/7719185/1766230
		var s = document.createElement('script');
		var r = false;
		var t;
		s.type = 'text/javascript';
		s.src = "scripts/" + url + ".js";
		s.className = "rocketboots-script";
		s.onload = s.onreadystatechange = function() {
			//console.log( this.readyState ); //uncomment this line to see which ready states are called.
			if ( !r && (!this.readyState || this.readyState == 'complete') )
			{
				r = true;
				if (typeof callback == "function") callback();
			}
		};
		t = document.getElementsByTagName('script')[0];
		t.parentNode.insertBefore(s, t);	
	},
	installComponent : function(fileName, componentClassName, componentClass){
		var o = this;
		if (typeof o.components[fileName] == "undefined") {
			o.components[fileName] = new o.Component(fileName);
		}
		o.components[fileName].name = componentClassName;
		o.components[fileName].isInstalled = true;
		o[componentClassName] = componentClass;
	},
	loadComponents : function(arr){
		var o = this;
		var componentName;

		for (var i = 0, al = arr.length; i < al; i++){
			componentName = arr[i];
			if (typeof o.components[componentName] == "undefined") {
				o.components[componentName] = new o.Component(componentName);
				o.loadScript("rocketboots/" + arr[i], function(){
					o.components[componentName].isLoaded = true;
				});
			} else {
				console.error("Component already exists", componentName);
			}
		}
	},
	areAllComponentsLoaded : function(){
		var o = this;
		var componentCount = 0,
			componentsInstalledCount = 0;
		for (var c in o.components) {
			// if (o.components.hasOwnProperty(c)) {  do stuff	}
			componentCount++;
			if (o.components[c].isInstalled) componentsInstalledCount++;
		}
		console.log("RB Installed: " + componentsInstalledCount + "/" + componentCount);
		return (componentsInstalledCount >= componentCount);
	},
	ready : function(callback){
		if (typeof callback == "function") {
			if (this.isInitialized) {
				callback(this);
			} else {
				this.readyFunctions.push(callback);
			}
		} else {
			console.error("Ready argument (callback) not a function");
		}
	},
	runReadyFunctions : function(){
		var o = this;
		// Loop over readyFunctions and run each one
		var f, fn;
		for (var i = 0; o.readyFunctions.length > 0; i++){
			f = o.readyFunctions.splice(i,1);
			fn = f[0];
			fn();
		}		
	},
	init : function(attempt){
		var o = this;
		if (typeof attempt == "undefined") attempt = 0;
		attempt++;
		//console.log("RB Init", attempt);
		if (attempt > 20) {
			console.error("Could not initialize RocketBoots");
			return false;
		}

		if (typeof $ == "undefined") {
			if (attempt == 1) {
				// Create "rb" alias
				if (typeof window.rb != "undefined") {
					o._rb = window.rb;
				}
				window.rb = o;			
				// Load jQuery
				o.loadScript("libs/jquery-2.1.1.min", function(){
					o.init(attempt);
				});
			} else {
				o.init(attempt);
			}
		} else {	// jQuery is loaded, so continue with initialization
		
			if (o.areAllComponentsLoaded()) {
				console.log("RB Init - All components are loaded. Running Ready functions");
				o.runReadyFunctions();
				o.isInitialized = true;
				return true;
			} else {
				// Try again
				var initTimer = window.setTimeout(function(){ 
					o.init(attempt);
				}, 10);
				return false;
			}
		}
	}

};

//======================================================= Game Functions ======

RocketBoots.Game.prototype.init = function(){
	//console.log("Initializing Game");
	var g = this;
	
	if (typeof RocketBoots == "object"){
		RocketBoots.addComponentsToGame(g);
	}
}

RocketBoots.Game.prototype.cloneDataObject = function (o) {
	return JSON.parse(JSON.stringify(o));
}

RocketBoots.init();
