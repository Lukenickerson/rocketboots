
(function(){
	var fileName = "canvas";
	var Canvas = function(){
	
	}
	
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(fileName, "Canvas", Canvas);
	} else window.Canvas = Canvas;
})();