/*
	[Template Name] 
	[myClassName] Class
	By Luke Nickerson, 2014
*/

(function(){
	var myFileName = "component_name";
	var myClassName = "ComponentClassName";

	var comp = function(){
		// this.vars = 1;

	}
	
	//comp.prototype.someFunction = function(){
	//
	//};


	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, comp);
	} else window[myClassName] = comp;
})();