/*
	Image Overseer
	ImageOverseer Class
	By Luke Nickerson, 2014
*/

(function(){
	var FILE_NAME = "image_overseer";
	var CLASS_NAME = "ImageBank";
	
	function ComponentClass() {
		this.images = {};
		this.path = "images/";
	}
	ComponentClass.prototype.get = function(imageName){
		return this.images[imageName];
	}
	ComponentClass.prototype.getAll = function(){
		return this.images;
	}
	ComponentClass.prototype.load = function(imageFileMap, callback) 
	{
		this.images = this.loadImages(imageFileMap, callback);
	}
	ComponentClass.prototype.loadImages = function(imageFileMap, callback) 
	{
		var o = this;
		var imagesCount = 0;
		var imagesLoadedCount = 0;
		var sourceUrl = "";
		// Get the total count of images
		for (var v in imageFileMap) {
			imagesCount++;
		}
		// Output object
		var images = {};
		// Loop through once more to convert the imageFileMap so it contains images
		for (var v in imageFileMap) {
			sourceUrl = imageFileMap[v];
			if (typeof sourceUrl === 'string') {
				images[v] = new Image();
				images[v].src = o.path + sourceUrl;
				images[v].onload = function () {
					imagesLoadedCount++;
					if (imagesLoadedCount >= imagesCount) {
						console.log("ImageOverseer: All " + imagesCount + " images loaded.");
						if (typeof callback == "function") callback();
					}
				}
			}
		}
		console.log("ImageOverseer: Loading " + imagesCount + " images. (" + imagesLoadedCount + " done so far.)");
		return images;
	}
	
	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(FILE_NAME, CLASS_NAME, ComponentClass);
	} else {
		window[CLASS_NAME] = ComponentClass;
	}
})();