chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

var c_localStorageKey_co2 = "co2";

function AddCo2(co2ToAdd)
{
	localStorage[c_localStorageKey_co2] = parseInt(localStorage[c_localStorageKey_co2]) + co2ToAdd;
}

$(function(){
	
	//page loaded
	AddCo2(1);
	console.log("CO2 : PAGE LOAD DETECTED : " + window.location.host);
	console.log("CO2 : +1 = " + localStorage[c_localStorageKey_co2]);

	//html5 video
    var video = $('video');
    video.on('playing', function(){
		AddCo2(10);
		console.log("CO2 : PLAYING VIDEO DETECTED");
		console.log("CO2 : +10 = " + localStorage[c_localStorageKey_co2]);
    });
    video.on('pause', function(){
		console.log("CO2 : STOPPED VIDEO DETECTED");
    });
	
})

