/*
	Sound Cannon
	SoundCannon Class
	By Luke Nickerson, 2014
*/

(function(){
	var myFileName = "sound_cannon";
	var myClassName = "SoundCannon";
	
	var sc = function() {
		this.sounds = {};
		this.isSoundOn = true;
	};
	sc.prototype.on = function() {
		this.isSoundOn = true;
	}
	sc.prototype.off = function() {
		this.isSoundOn = false;
	}
	sc.prototype.toggle = function (forceSound) {
		if (typeof forceSound === 'boolean') 	this.isSoundOn = forceSound;
		else									this.isSoundOn = (this.isSoundOn) ? false : true;
		return this.isSoundOn;	
	}
	sc.prototype.loadSounds = function(soundNameArray, directory, extension) {
		if (typeof directory != "string") directory = "sounds/";
		if (typeof extension != "string") extension = ".mp3";
		var sn, snL = soundNameArray.length;
		for (var i = 0; i < snL; i++) {
			sn = soundNameArray[i];
			// *** if array is another array, then use index 0 as name, index 1 as volume
			this.sounds[sn] = new Audio(directory + sn + extension);
			this.sounds[sn].volume = 0.6;
		}
		console.log("Loaded", snL, "sounds.");
	}
	sc.prototype.play = function (soundName, isLooped)
	{
		if (this.isSoundOn) {	
			if (typeof this.sounds[soundName] === 'undefined') {
				console.log("Sound does not exist: " + soundName);
				return false;
			} else {
				if (typeof isLooped === 'boolean') {
					this.sounds[soundName].loop = isLooped;
				}
				this.sounds[soundName].play();
				return true;
			}
		} else {
			return false;
		}
	}
	
	sc.prototype.stop = function(soundName){
		this.sounds[soundName].pause();
	}

	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, sc);
	} else window[myClassName] = sc;
})();
	