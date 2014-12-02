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
	sm.prototype.State = function(name, settingsObj){
		this.name	= name;
		this.$view	= $('.state.'+ name);
		this.start 	= settingsObj.start || function(){
			this.$view.show();
		};
		this.end 	= settingsObj.end || function(){
			this.$view.hide();
		};
	}
	sm.prototype.getState = function(name){
		if (typeof this.states[name] == "undefined") {
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
		this.currentState = this.getState(newState);
		this.currentState.start();
		return this;
	}
	sm.prototype.start = function(stateName){
		$('.state').hide();
		this.currentState = this.getState(stateName);
		this.currentState.start();
		return this;
	}
	//sm.prototype.init();

	// Install into RocketBoots if it exists, otherwise make global		
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, sm);
	} else window[myClassName] = sm;
	window[myClassName] = sm;
})();