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
	co2Count += parseFloat(co2ToAdd);
	SaveCo2Count(co2Count);	
}

function SaveCo2Count(value)
{
	chrome.storage.sync.set({'co2Count': value}, function() {
		message('co2Count saved');
	});
}

var videoTimer;
var videoPlaying = false;

function VideoStarted()
{
	videoPlaying = true;	
	videoTimer = window.setInterval("VideoPlaying()", 1000);
}

function VideoPlaying()
{
	var co2 = 0.02;
	AddCo2(co2);	
	console.log("CO2 : +" + co2 + " = " + co2Count);
}

function VideoStopped()
{	
	videoPlaying = false;
	console.log("CO2 : STOPPED VIDEO DETECTED");
	window.clearInterval(videoTimer);
}

function PageLoaded()
{
	var co2 = 1.1;
	AddCo2(co2);
	console.log("CO2 : PAGE LOAD DETECTED : " + window.location.host);
	console.log("CO2 : +" + co2 + " = " + co2Count);
}

function InitCo2Detections()
{
	//html5 video
    var video = $('video');
	if(video.length > 0){
		if(!video.paused && !videoPlaying){ //since the co2Count take some times to come from the storage, the video might be playing already
			VideoStarted()
		}
		video.on('playing', function(){
			if(!video.paused && !videoPlaying){
				VideoStarted()
			}
		});
		video.on('pause', function(){
			VideoStopped();
		});
	}

	//page loaded
	PageLoaded();
}

//init
$(function(){
	chrome.storage.sync.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveCo2Count(obj.co2Count); }
		co2Count = obj.co2Count;
		InitCo2Detections();
	});	
})

/*

1 km en voiture = 250 gCO2
1 km en avion par personne = 85 gCO2 (attention à celui la, possible qu'il envoit un mauvais signal, les gens peuvent se dire que ca n'émet pas bcp en fait l'avion...)
frigo allumé pendant 1 heure en France = 2,6 gCO2
incinération d'1 kg de papier en France = 46,6 gCO2


ampoule fr 8 gCO2/heure
Si on fait une moyenne Europe, ca serait plutôt 29 gCO2/heure.

mail	0.004	4.00
mail avec PJ (1Mo)	0.035	35.00
tweet	0.00002	0.02
achat sur le web	0.00755	7.55
requête de navigation web	0.00101	1.01
requête internet	0.0065	6.50
spam	0.00005	0.05

*/