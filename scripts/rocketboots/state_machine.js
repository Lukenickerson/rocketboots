/*
	State Machine 
	By Luke Nickerson, 2014
	REQUIRES: jQuery ($)
*/

(function(){
	var myFileName = "state_machine";
	var myClassName = "StateMachine";


	var sm = function(){
		this.states = {};
		this.currentState = null;
	}

	// Getters
	sm.prototype.get = function(name){
		if (typeof name == "undefined") {
			return this.currentState;
		} else if (typeof this.states[name] == "undefined") {
			console.error("State Machine: No such state " + name);
			return false;
		} else {
			return this.states[name];
		}
	}
	sm.prototype.add = function(name, settingsObj){	
		if (typeof settingsObj == "function") {
			settingsObj = { start : settingsObj };
		} else if (typeof settingsObj != "object") {
			settingsObj = {};
		}
		this.states[name] = new this.State(name, settingsObj);
		return this;
	}
	sm.prototype.transition = function(newState){
		console.log("State Machine: Transition from " + this.currentState.name + " to " + newState);
		this.currentState.end();
		this.currentState = this.get(newState);
		this.currentState.start();
		return this;
	}
	sm.prototype.start = function(stateName){
		$('.state').hide();
		this.currentState = this.get(stateName);
		this.currentState.start();
		return this;
	}
	//sm.prototype.init();

	//==== State Class
	sm.prototype.State = function(name, settingsObj){
		this.name	= name;
		this.$view	= $('.state.'+ name);
		this.start 	= null;
		this.end 	= null;
		this.update	= null;
		this.type 	= settingsObj.type || null;
		// Init
		this.setStart(settingsObj.start);
		this.setEnd(settingsObj.end);
		this.setUpdate(settingsObj.update);
	}
	// Setters
	sm.prototype.State.prototype.setStart = function(fn){
		if (typeof fn == "function") this.start = fn;
		else this.start = function(){
			this.$view.show();
		};
		return this;
	}
	sm.prototype.State.prototype.setEnd = function(fn){
		if (typeof fn == "function") this.end = fn;
		else this.end = function(){
			this.$view.show();
		};
		return this;
	}
	sm.prototype.State.prototype.setUpdate = function(fn){
		if (typeof fn == "function") this.update = fn;
		else this.update = function(){	};
		return this;
	}
	// Getters
	sm.prototype.State.prototype.getType = function(){
		return this.type;
	}
	
	
	
	
	// Install into RocketBoots if it exists, otherwise make global		
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, sm);
	} else window[myClassName] = sm;
	window[myClassName] = sm;
})();