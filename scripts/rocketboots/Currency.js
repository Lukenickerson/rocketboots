(function(){
	var component = {
		fileName: 		"Currency", 
		classNames:		["Currency"],
		requirements:	[],
		description:	"Currency class, useful for incremental games",
		credits:		"previously part of incrementer; by Luke Nickerson 2015-2016"
	};

	var Currency = component.Currency = function CurrencyClass (options){
		options 		= options || {};
		this.name 		= (options.name || options.elementId || "Currency_" + Math.round(Math.random() * 9999999));
		this.displayName = (options.displayName || this.name);
		this.symbol 	= (options.symbol || "");
		this.symbolBefore = true;
		//this.showRate	= (typeof options.showRate === "boolean") ? options.showRate : true;
		//this.showMax	= (typeof options.showMax === "boolean") ? options.showMax : false;
		this.rate 		= getDefaultNumber(options.rate, 0); // Increase per step
		this.min 		= getDefaultNumber(options.min, 0);
		this.max 		= getDefaultNumber(options.max, 1000000000); // 1B default
		this.val 		= getDefaultNumber(options.val, this.min);
		this.stepsPerSecond = getDefaultNumber(options.stepsPerSecond, 1);
		this.lastUpdated = new Date();
		this.mathMethodForDisplay	= (options.mathMethodForDisplay || "floor");

		//this.hasCalculations = (options.calcRate || options.calcValue || options.calcMax) ? true : false;
		this.calcRate 	= (options.calcRate || undefined);
		this.calcValue 	= (options.calcValue || undefined);
		this.calcMax 	= (options.calcMax || undefined);

		if (typeof options.element === "object") {
			this.element	= options.element;	
		} else if (typeof options.elementId === "string") {
			this.element	= RocketBoots.document.getElementById(options.elementId);
		} else {
			this.element = RocketBoots.document.getElementById(this.name);
		}
		
		if (typeof options.callback == "function") {
			this.increment = function (steps){
				this._increment(steps);
				options.callback();
			}
			this.incrementByElapsedTime = function (now) {
				this._incrementByElapsedTime(now);
				options.callback();
			}
		}
		/* else {
			this.increment = this._increment;
			this.incrementByElapsedTime = this._incrementByElapsedTime;
		}
		*/
		function getDefaultNumber (a, b) {
			if (typeof a === "number") {
				return a;
			} else {
				return b;
			}
		}

	};

	Currency.prototype.getPercent = function(){
		if (this.max == 0) { return 0; }
		return this.val / this.max;
	}
	
	Currency.prototype.add = function(amount){
		if (typeof amount === "number") {
			this.val += amount;
		}
		this.correctBounds();
		return this;
	};
	Currency.prototype.subtract = function(amount) {
		this.add( -1 * amount );
	};
	Currency.prototype.zero = function () {
		this.val = 0;
		this.correctBounds();
		return this;
	};
	Currency.prototype.correctBounds = function(){
		if (this.val > this.max) {
			this.val = this.max;
		} else if (this.val < this.min) {
			this.val = this.min;
		}
		return this;
	};	

	Currency.prototype.calculate = function(arg){
		//if (!this.hasCalculations) { return this; }
		_calculate.apply(this, ["rate", "calcRate", arg]);
		_calculate.apply(this, ["val", "calcValue", arg]);
		_calculate.apply(this, ["max", "calcMax", arg]);
		return this;
	};
	function _calculate (prop, methodName, arg) {
		if (typeof this[methodName] === "function") {
			var x = this[methodName](arg);
			if (typeof x === 'number') {
				this[prop] = x;
			} else {
				console.warn("Tried to set", this.name, " ", prop, "based on", methodName, "but its not a number.", this);
			}
		} else {
			//console.log("No methodName", methodName, "on", this);
		}		
	}


	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
	Object.defineProperty(Currency.prototype, "displayValue", { get: function() {
		if (this.val === NaN) { console.warn("displayValue NaN"); }
		return Math[this.mathMethodForDisplay](this.val);
	}});
	Object.defineProperty(Currency.prototype, "displayMax", { get: function() {
		return Math[this.mathMethodForDisplay](this.max);
	}});

	// FIXME: Move this to somewhere else?
	Currency.prototype.draw = function () {
		if (typeof this.element === 'undefined' || this.element === null) {
			return false;
		}
		var ratePerSecond = Math.round(this.rate * this.stepsPerSecond * 10)/10;
		var plus = (ratePerSecond < 0) ? "" : "+";
		var text = this.displayValue;
		var html = text;
		var symbol = "";
		
		text += " / " + this.displayMax;
		html += '<span class="currency-out-of">/</span><span class="currency-max">' + this.displayMax + '</span>';

		if (ratePerSecond != 0) {
		 	text += " (" + plus + ratePerSecond + "/s)";
		 	html += " (" + plus + ratePerSecond + "/s)";
		}
		if (this.symbol.length > 0 && this.symbolBefore) {
			html = '<span class="currency-symbol">' + this.symbol + '</span>' + html;
		}
		this.element.innerHTML = html;
		this.element.setAttribute("title", this.displayName + ": " + text);
		return true;
	}

	Currency.prototype._increment = function(steps){
		this.add(steps * this.rate);
		this.lastUpdated = new Date();
		//console.log(this.name, this.val);
		return this;
	};

	Currency.prototype._incrementByElapsedTime = function(now){
		if (typeof now === "undefined") { now = new Date(); }
		var secondsElapsed = (now - this.lastUpdated) / 1000;
		this.add(this.stepsPerSecond * secondsElapsed * this.rate);
		this.lastUpdated = now;
		//console.log(this.name, this.val);
		return this;
	};

	Currency.prototype.increment = Currency.prototype._increment;
	Currency.prototype.incrementByElapsedTime = Currency.prototype._incrementByElapsedTime;


	// Install into RocketBoots if it exists
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(component);
	} else { // Otherwise put the classes on the global window object
		for (var i = 0; i < component.classNames.length; i++) {
			window[component.classNames[i]] = component[component.classNames[i]];
		}
	}
})();