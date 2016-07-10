chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
	}}, 10);
});

var co2Count = 0;

function AddCo2(co2ToAdd)
{
	co2Count += parseInt(co2ToAdd);
	SaveCo2Count(co2Count);	
}

function SaveCo2Count(value)
{
	chrome.storage.sync.set({'co2Count': value}, function() {
		message('co2Count saved');
	});
}

function InitCo2Detections()
{
	//html5 video
    var video = $('video');console.log(video)
	if(video.length > 0){
		if(!video.paused){ //since the co2Count take some times to come from the storage, the video might be playing already
			AddCo2(10);
			console.log("CO2 : PLAYING VIDEO DETECTED");
			console.log("CO2 : +10 = " + co2Count);
		}
		video.on('playing', function(){
			AddCo2(10);
			console.log("CO2 : PLAYING VIDEO DETECTED");
			console.log("CO2 : +10 = " + co2Count);
		});
		video.on('pause', function(){
			console.log("CO2 : STOPPED VIDEO DETECTED");
		});
	}

	//page loaded
	AddCo2(1);
	console.log("CO2 : PAGE LOAD DETECTED : " + window.location.host);
	console.log("CO2 : +1 = " + co2Count);
}

//init
$(function(){
	chrome.storage.sync.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj = 0; SaveCo2Count(0); }
		co2Count = obj.co2Count;
		InitCo2Detections();
	});	
})
