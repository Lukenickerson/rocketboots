/*
	Looper 
	By Luke Nickerson, 2014
*/

(function(){
	var myFileName = "looper";
	var myClassName = "Looper";

	var loop = function(){
		this.vars = 1;

	}
	
	loop.prototype.someFunction = function(){
	
	};


	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, loop);
	} else window[myClassName] = loop;
})();