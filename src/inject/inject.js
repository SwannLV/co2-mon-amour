chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		//console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
	}}, 10);
});


////////////// TODO : TOOLS CLASS ////////////
function GetQueryStringInUrl(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//////////////////////////////////////////////

var co2Count = 0;

function AddCo2(co2ToAdd)
{
	chrome.storage.local.get("co2Count", function (obj) { 
		if(!isNaN(obj.co2Count)){	
			co2Count = parseFloat(obj.co2Count);
			co2Count += parseFloat(co2ToAdd);
			SaveCo2Count(co2Count);	
		}
	});	
	
}

function SaveCo2Count(value)
{
	chrome.storage.local.set({'co2Count': value}, function() {
		console.log('local storage : co2Count saved');
	});
}

var videoTimer;
var videoPlaying = false;
var nbSecondsVideoInterval = 5;

function VideoStarted()
{
	videoPlaying = true;	
	videoTimer = window.setInterval("VideoPlaying()", 1000 * nbSecondsVideoInterval);
}

function VideoPlaying()
{
	var co2 = 0.02 * nbSecondsVideoInterval;
	AddCo2(co2);	
	console.log("CO2 : +" + co2 + " = " + co2Count);
}

function VideoStopped()
{	
	videoPlaying = false;
	console.log("CO2 : STOPPED VIDEO DETECTED");
	window.clearInterval(videoTimer);
}

function GoogleSearch()
{
	var co2 = 6.5;
	AddCo2(co2);
	console.log("CO2 : GOOGLE SEARCH : " + window.location.host);
	console.log("CO2 : +" + co2 + " = " + co2Count);
}

function RegularPageLoaded()
{
	var co2 = 1.1;
	AddCo2(co2);
	console.log("CO2 : REGULAR PAGE LOAD DETECTED : " + window.location.host);
	console.log("CO2 : +" + co2 + " = " + co2Count);
}

function PageLoaded()
{
	var host = window.location.host;
	if(host.indexOf(".google.") > -1 && GetQueryStringInUrl("q")){
		GoogleSearch();
	}
	else{
		RegularPageLoaded();
	}
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
	chrome.storage.local.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveCo2Count(obj.co2Count); }
		co2Count = obj.co2Count;
		InitCo2Detections();
	});	
})

/*


requête de navigateur web c'est quand tu mets directement l'adresse du site web
1.01

requête internet c'est une recherche.
6.5

Pour 1 sec de video - source googlegreen
0,02

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