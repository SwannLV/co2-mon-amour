

$(function(){

  // chrome.browserAction.setBadgeText({
  //   text: "1"
  // });

  console.log(localStorage["co2"])
  $("#co2-count").html("XXX gCO2");
  
  chrome.storage.local.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveCo2Count(obj.co2Count); }
		co2Count = obj.co2Count;
		 $("#co2-count").html(parseInt(co2Count));
	});	

});