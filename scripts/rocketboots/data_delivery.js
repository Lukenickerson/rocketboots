/*
	Data Delivery
	DataDelivery Class
	By Luke Nickerson, 2014
	REQUIRES: jQuery ($)
*/

(function(){
	var myFileName = "data_delivery";
	var myClassName = "DataDelivery";

	var dd = function (dataVarName) {
	{
		this.dataVarName = dataVarName;
	}
	dd.prototype.deliver = function (jsonUrl, callback) {
	
			var v = this.dataVarName;
			$.ajax({
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
	if (!window.jQuery) { console.log("WARNING - jQuery is not loaded!"); }
	
	
	// Install into RocketBoots if it exists, otherwise make global
	if (typeof RocketBoots == "object") {
		RocketBoots.installComponent(myFileName, myClassName, dd);
	} else window[myClassName] = dd;
})();