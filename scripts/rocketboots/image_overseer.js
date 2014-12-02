/*
	Image Overseer
	ImageOverseer Class
	By Luke Nickerson, 2014
*/

(function(){
	var myFileName = "image_overseer";
	var myClassName = "ImageOverseer";
	
	var io = function(){
		this.images = {};
		this.path = "images/";
	}
	io.prototype.get = function(imageName){
		return this.images[imageName];
	}
	io.prototype.getAll = function(){
		return this.images;
	}
	io.prototype.load = function(imageFileMap, callback) 
	{
		this.images = this.loadImages(imageFileMap, callback);
	}
	io.prototype.loadImages = function(imageFileMap, callback) 
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
		RocketBoots.installComponent(myFileName, myClassName, io);
	} else window[myClassName] = io;
})();