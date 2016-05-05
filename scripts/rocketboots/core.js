var RocketBoots = {

	isInitialized : false,
	readyFunctions : [],
	components : {},
	loadedScripts: [],
	_initTimer : null,
	_MAX_ATTEMPTS : 300,
	_BOOTING_ELEMENT_ID : "booting-up-rocket-boots",
	_: null, // Lodash
	$: null, // jQuery
	
//==== Classes

	Component : function(c){
		this.fileName = c;
		this.name = null;
		this.isLoaded = false;
		this.isInstalled = false;	
	},
	
//==== General Functions
	log : console.log,
	loadScript : function(url, callback){
		//console.log("Loading script", url);
		// http://stackoverflow.com/a/7719185/1766230
		var o = this;
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
				o.loadedScripts.push(url);
				if (typeof callback == "function") callback();
			}
		};
		t = document.getElementsByTagName('script')[0];
		t.parentNode.insertBefore(s, t);
		return this;
	},

//==== Component Functions

	hasComponent: function (componentClass) {
		if (typeof RocketBoots[componentClass] == "function") {
			return true;
		} else {
			return false;
		}
	},	
	installComponent : function(fileName, componentClassName, componentClass, requirements, callback){
		var o = this;
		if (!o.areComponentsLoaded(requirements)) {
			console.warn("Component(s) missing", requirements);
			var compTimer = window.setTimeout(function(){ 
				o.installComponent(fileName, componentClassName, componentClass, requirements, callback);
			}, 10000);
		} else {
			if (typeof o.components[fileName] == "undefined") {
				o.components[fileName] = new o.Component(fileName);
			}
			if (typeof callback === "function") {
				callback();
			}
			o.components[fileName].name = componentClassName;
			o.components[fileName].isInstalled = true;
			o[componentClassName] = componentClass;
		}
		return this;
	},
	getComponentByName: function (componentName) {
		var o = this;
		for (var cKey in o.components) {
			if (o.components[cKey].name == componentName) {
				return o.components[cKey];
			}
		};
		return;
	},
	areComponentsLoaded: function (componentNameArr) {
		var o = this, areLoaded = true;
		if (typeof componentNameArr !== 'object') {
			return areLoaded;
		}
		for (var i = 0; i < componentNameArr.length; i++) {
			if (!o.isComponentInstalled(componentNameArr[i])) { areLoaded = false; }
		};
		return areLoaded;
	},
	isComponentInstalled: function (componentName) {
		var comp = this.getComponentByName(componentName);
		return (comp && comp.isInstalled);
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
				//console.error("Component already exists", componentName);
			}
		}
		return this;
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
		console.log("RB Components Installed: " + componentsInstalledCount + "/" + componentCount);
		return (componentsInstalledCount >= componentCount);
	},

//==== Ready and Init Functions

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
		return this;
	},
	runReadyFunctions : function(){
		var o = this;
		// Loop over readyFunctions and run each one
		var f, fn;
		for (var i = 0; o.readyFunctions.length > 0; i++){
			f = o.readyFunctions.splice(i,1);
			fn = f[0];
			fn(o);
		}
		return this;	
	},
	init : function(attempt){
		var o = this;
		// TODO: allow dependecies to be injected rather than forcing them to be on the window scope
		var isJQueryUndefined = (typeof $ === "undefined");
		var isLodashUndefined = (typeof _ === "undefined");
		var areRequiredScriptsMissing = isJQueryUndefined || isLodashUndefined;

		if (typeof attempt === "undefined") { 
			attempt = 1; 
		} else if (attempt > o._MAX_ATTEMPTS) {
			console.error("Could not initialize RocketBoots");
			return false;
		} else {
			attempt++;
		}
		//console.log("RB Init", attempt, (areRequiredScriptsMissing ? "Waiting on required objects from external scripts" : ""));

		if (!isJQueryUndefined) {
			o.$ = $;
		}
		if (!isLodashUndefined) {
			o._ = _;
		}

		function tryAgain () {
			// Clear previous to stop multiple inits from happening
			window.clearTimeout(o._initTimer);
			o._initTimer = window.setTimeout(function(){
				o.init(attempt);
			}, (attempt * 10));
		}

		// On first time through, do some things
		if (attempt === 1) {
			// Create "rb" alias
			if (typeof window.rb !== "undefined") {
				o._rb = window.rb;
			}
			window.rb = o;	
			// Load default components
			// TODO: make this configurable
			this.loadComponents(["Game"]);

			// Load required scripts
			if (isJQueryUndefined) {
				o.loadScript("libs/jquery-2.1.1.min", function(){
					//o.init(1);
				});
			} 
			if (isLodashUndefined) {
				o.loadScript("libs/lodash.min", function(){ });
			}
		}

		if (o.areAllComponentsLoaded() && !areRequiredScriptsMissing) {
			console.log("RB Init - All scripts and components are loaded.", o.loadedScripts, " \nRunning Ready functions.\n");
			o.$('#' + o._BOOTING_ELEMENT_ID).hide();
			o.runReadyFunctions();
			o.isInitialized = true;
			return true;
		}

		tryAgain();
		return false;
	}

};

RocketBoots.init();
