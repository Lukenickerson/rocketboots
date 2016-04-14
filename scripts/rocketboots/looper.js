/*
	Looper 
	By Luke Nickerson, 2014-2015
*/

(function(){
	var myFileName = "looper";
	var myClassName = "Looper";

	var Loop = function(fn, delay){
		this.fn			= fn;
		this.isLooping 	= false;
		this.timer 		= 0;
		this.iteration 	= 0;
		//this.lastTime 	= 0;
		this.setDelay(delay)
		// Update certain things once every X iterations
		this.modulusActions 	= [];
		this.numOfModulusActions = 0;
	}
	
	Loop.prototype._reloop = function(o){
		if (o.isLooping) {
			o.iteration++;
			o.timer = window.setTimeout(function(){
				o.loop(); 
			}, o.delay);
		}			
	}
	Loop.prototype._safeReloop = function(o){
		if (o.isLooping) {
			o.iteration++;
			// --- Safety to prevent infinite loops ---
			if (o.iteration < 15000000) {
				o.timer = window.setTimeout(function(){
					o.loop(); 
				}, o.delay); 
			} else {
				o.iteration = 0;
				o.togglePause(true);
			}
		}			
	}
	
	Loop.prototype.loop = function(){
		var o = this;

		for (var mai = 0; mai < o.numOfModulusActions; mai++){
			if ((o.iteration % o.modulusActions[mai].loopModulus) == 0) {
				o.modulusActions[mai].loopFunction();
			}
		}	
		o.fn(o.iteration);
		o._reloop(o);	
	};

	Loop.prototype.start = function(){
		this.isLooping = true;
		this.numOfModulusActions = this.modulusActions.length;
		this.loop();
	}
	Loop.prototype.pause = function(){
		this.isLooping = false;
		window.clearTimeout(this.timer);
	}	
	Loop.prototype.stop = function(){
		this.pause();
		this.iteration 	= 0;
	}

	/*
	Loop.prototype.togglePause = function (forcePause) {
		if (typeof forcePause === 'boolean') {
			if (this.isLooping == !forcePause) return false;
			this.isLooping = !forcePause;
		} else {
			this.isLooping = !this.isLooping;
		}
		if (this.isLooping) this.loop();
		console.log("Game " + ((this.isLooping) ? "un" : "") + "paused.");
	}
	*/
	
	Loop.prototype.setDelay = function(d){
		this.delay = d || 14;
		// ^ Decrease delay for more fps, increase for less fps
		// 1000 = 1 second
		// 100 = 1/10th of a second
		// 16 = 1/?th of a second = 62.5 fps (closest to 60 fps)
		// 15 = 66.667 fps
		// 14 = 71.429 fps
		// 10 = 1/100th of a second = 100 fps
		// Needs to be less than 16 to accomodate for the time it takes to run the loop 'stuff'		
		this.framesPerSecond = (1000 / this.delay);
		this.secondsPerLoop	= (this.delay / 1000);
		return this;
	}
	
	Loop.prototype.addModulusAction = function(tps, fn)
	{
		// tps = times per second
		// framesPerSecond = once per second
		// framesPerSecond/2 = twice per second
		var ma = {
			loopModulus : Math.round(this.framesPerSecond/tps),
			loopFunction : fn
		};
		this.modulusActions.push(ma);
		this.numOfModulusActions = this.modulusActions.length;
		return (this.modulusActions.length - 1);
	}
	Loop.prototype.removeModulusAction = function(index)
	{	
		return this.modulusActions.splice(index, 1);
	}
	
	

	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, Loop);
	} else window[myClassName] = Loop;
})();