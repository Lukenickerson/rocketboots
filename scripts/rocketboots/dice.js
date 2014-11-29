

this.randSeed = 1;

	this.roll1d = function (sides) {
		return (Math.floor(Math.random()*sides) + 1);
	}
	
	this.getRandomNumber = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	
WorldClass.prototype.random = function(){
    // http://stackoverflow.com/a/19303725/1766230
    var x = Math.sin(this.randSeed++) * 10000;
    return x - Math.floor(x);
}

g.getRandomAround = function(n){ // BELL
    var a = Math.random() * n;
    var b = Math.random() * n;
    return (a-b);
}