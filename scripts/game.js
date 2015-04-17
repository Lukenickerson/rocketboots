RocketBoots.loadComponents([
	"coords",
	"sound_cannon",
	"image_overseer",
	"state_machine",
	"dice",
	"looper",
	"entity",
	"world",
	"stage"
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
	
	
	g.loop = new rb.Looper(function(){
		g.stage.draw();
	});
	
	for (var i = 0; i < 100; i++) {
		g.world.addEntity();
	}
	
	g.ball = g.world.entities[0];
	g.ball.vel.x = 1;
	g.ball.vel.y = 4;
	g.stage.camera.follow(g.ball.pos);


	var mainLayer = g.stage.addLayer();
	mainLayer.connectEntities( g.world.entities );
	
	
	// Start 'er up!
	g.state.transition("game");
	g.loop.addModulusAction(30, function(){
		//console.log(g.ball.pos);
		g.ball.pos.add(g.ball.vel);
		var hitWall = g.world.keepCoordsInRange(g.ball.pos);
		if (hitWall) {
			g.ball.vel.multiply(-1);
		}
	});
	g.stage.draw();
	g.stage.resize();
	g.stage.addClickEvent(function(p){ 
		console.log("clicked world position", p);
	});
	g.loop.start();
	//g.stage = new rb.Stage("game-stage");
});