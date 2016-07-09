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



$(function(){

	//page loaded
	console.log("CO2 : PAGE LOAD DETECTED : " + window.location.host);

	//html5 video
    var video = $('video');
    video.on('playing', function(){
		console.log("CO2 : PLAYING VIDEO DETECTED");
    });
    video.on('pause', function(){
		console.log("CO2 : STOPPED VIDEO DETECTED");
    });
	
})