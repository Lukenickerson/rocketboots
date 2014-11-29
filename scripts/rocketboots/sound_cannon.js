
	
function SoundCannonClass () {
	this.sounds = {};
	this.isSoundOn = true;
	this.on = function() {
		this.isSoundOn = true;
	}
	this.off = function() {
		this.isSoundOn = false;
	}
	this.toggle = function (forceSound) {
		if (typeof forceSound === 'boolean') 	this.isSoundOn = forceSound;
		else									this.isSoundOn = (this.isSoundOn) ? false : true;
		return this.isSoundOn;	
	}

	this.loadSounds = function(soundNameArray, directory, extension) {
		directory = "sounds/";
		extension = ".mp3";
		var sn, snL = soundNameArray.length;
		for (var i = 0; i < snL; i++) {
			sn = soundNameArray[i];
			// *** if array is another array, then use index 0 as name, index 1 as volume
			this.sounds[sn] = new Audio(directory + sn + extension);
			this.sounds[sn].volume = 0.6;
		}
		console.log("Loaded", snL, "sounds.");
	}
	
	this.play = function (soundName, isLooped)
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
}

window.soundCannon = new SoundCannonClass();
	