RocketBoots.loadComponents([
	"canvas",
	"coords",
	"sound_cannon",
	"image_overseer",
	"state_machine",
	"dice",
	"looper"
]);

var g = {};
RocketBoots.ready(function(){
	g = new RocketBoots.Game();
	
	console.log(rb);
	console.log(RocketBoots);
	g.coords = new rb.Coords();
	
	g.state.transition("preload");
	g.images.load({
		"dirt1" : "dirt1.png"
		,"dirt2" : "dirt2.png"
		,"grass1" : "grass1.png"
		,"grass2" : "grass2.png"
	});
	g.state.transition("mainmenu");
});