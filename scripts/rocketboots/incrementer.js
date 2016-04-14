/*
	Incrementer
	Incrementer class, useful for incremental games
	By Luke Nickerson, 2015
*/
(function(){

	var Incrementer = function(){
		this.x = null;
		this.currencies = {};
		this.currencyArray = [];
		this.currencyNum = 0;
	}
	Incrementer.prototype.addCurrency = function(name, displayName, val, perStep, min, max, callback){
		if (typeof this.currencies[name] == "object") {
			console.error("Currency", name, "already exists; cannot add again.");
			return false;
		} else {
			this.currencies[name] = new this.Currency(name, displayName, val, perStep, min, max, callback);
			this.currencyArray.push(name);
			this.currencyNum = this.currencyArray.length;
			return this;
		}
	}
	Incrementer.prototype.increment = function(steps){
		var i, curr;
		if (typeof steps != "number") steps = 1;
		this.loopOverCurrencies(function(curr){
			curr.increment(steps);
		});
	}
	Incrementer.prototype.loopOverCurrencies = function(callback){
		var i, curr;
		for (i = 0; i < this.currencyNum; i++){
			curr = this.currencies[ this.currencyArray[i] ];
			callback(curr);
		}	
	}
	
	
	
	Incrementer.prototype.Currency = function(name, displayName, val, perStep, min, max, callback){
		this.name = name;
		this.displayName = displayName;
		this.val = (val || 0);
		this.perStep = (perStep || 0); 
		this.min = (min || 0);
		this.max = (max || 1000000000);
		if (typeof callback == "function") {
			this.increment = function (steps){
				this._increment();
				callback(steps);
			}
		} else {
			this.increment = this._increment;
		}
	};
	Incrementer.prototype.Currency.prototype.add = function(amount){
		this.val += amount;
		//console.log(this.val);
		if (this.val > this.max) {
			this.val = this.max;
		} else if (this.val < this.min) {
			this.val = this.min;
		}
		return this;
	}
	Incrementer.prototype.Currency.prototype._increment = function(steps){
		this.add(steps * this.perStep);
		//console.log(this.name, this.val);
		return this;
	}


	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(
			"incrementer", 	// file name
			"Incrementer", 	// class name
			Incrementer		// class
		);
	} else window["Incrementer"] = Incrementer;
})();