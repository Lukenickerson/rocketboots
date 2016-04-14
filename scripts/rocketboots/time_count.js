/*
	Time Count
	TimeCount class, useful for incremental games
	By Luke Nickerson, 2015
*/
(function(){

	var TimeCount = function(){
		this.lastTime = null;
	}
	TimeCount.prototype.setLastTime = function(){
	
	}


	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(
			"time_count", 	// file name
			"TimeCount", 	// class name
			TimeCount		// class
		);
	} else window["TimeCount"] = TimeCount;
})();