
(function(){
	var fileName = "canvas_effects";
	var CanvasEffects = function(){
	
	}
	
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(fileName, "CanvasEffects", CanvasEffects);
	} else window.CanvasEffects = CanvasEffects;
})();