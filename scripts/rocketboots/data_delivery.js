/*
	Data Delivery
	DataDelivery Class
	By Luke Nickerson, 2014-2015
	REQUIRES: jQuery ($)
*/

(function(){
	// Requirements
	if (!window.jQuery) { 
		console.error("DataDelivery requires jQuery. jQuery is not loaded!"); 
	}
	
	// Create object
	var dd = function (dataVarName) {
		this.dataVarName = dataVarName;
	}

	dd.prototype.deliver = function (jsonUrl, callback) {
		var v = this.dataVarName;
		jQuery.ajax({
			type: 		"get"
			,url:		jsonUrl
			,dataType: 	"json"
			,complete: function(x,t) {
			}
			,success: function(responseObj) {
				try {
					if (v.length > 0) {
						window[v] = responseObj;
					}
					//var responseObj = $.parseJSON(response);
					console.log("Ajax Success loading data");
				} catch (err) {
					alert("ERROR IN JSON DATA");
					console.error("ERROR IN JSON DATA");
					console.log(responseObj);
				}
				if (typeof callback === 'function') callback(responseObj);
			}
			,failure: function(msg) {
				console.error("Fail\n"+ msg);
			}
			,error: function(x, textStatus, errorThrown) {
				console.error("Error\n" + x.responseText + "\nText Status: " + textStatus + "\nError Thrown: " + errorThrown);
			}
		});
	}

	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(
			"data_delivery", 	// file name
			"DataDelivery", 	// class name
			dd					// object
		);
	} else window["DataDelivery"] = dd;
})();