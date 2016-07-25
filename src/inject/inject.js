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

var _co2Count = 0;
var _streamingTimer;
var _streaming = false;
var _nbSecondsStreamingInterval = 5;
var _isHtml5Video = false;

function AddCo2(co2ToAdd)
{
	var key = "co2Count";
	chrome.storage.local.get(key, function (obj) { 
		if(!isNaN(obj.co2Count)){	
			_co2Count = parseFloat(obj.co2Count);
			_co2Count += parseFloat(co2ToAdd);
			SaveToLocalStorage(key, _co2Count);	
		}
	});	
	
}

function SaveToLocalStorage(key, value)
{
	var obj = {};
	obj[key] = value;
	chrome.storage.local.set(obj, function() {
		/*console.log('local storage \"' + key + '\" saved with value :');
    	console.log(value);*/
	});
}

function VideoStarted()
{
	_streaming = true;	
	console.log("CO2 : Video started");
	_streamingTimer = window.setInterval("VideoPlaying()", 1000 * _nbSecondsStreamingInterval);
}

function VideoPlaying()
{
	var co2 = 0.02 * _nbSecondsStreamingInterval;
	AddCo2(co2);	
	console.log("CO2 : +" + co2 + " = " + _co2Count);
}

function VideoStopped()
{	
	_streaming = false;
	console.log("CO2 : Video stopped");
	window.clearInterval(_streamingTimer);
}

function AudioStarted()
{
	_streaming = true;	
	console.log("CO2 : Audio started");
	_streamingTimer = window.setInterval("AudioPlaying()", 1000 * _nbSecondsStreamingInterval);
}

function AudioPlaying()
{
	var co2 = 0.01 * _nbSecondsStreamingInterval;
	AddCo2(co2);
	console.log("CO2 : +" + co2 + " = " + _co2Count);
}

function GoogleSearch()
{
	var co2 = 6.5;
	AddCo2(co2);
	console.log("CO2 : GOOGLE SEARCH : " + window.location.host);
	console.log("CO2 : +" + co2 + " = " + _co2Count);
}

function RegularPageLoaded()
{
	var co2 = 1.1;
	AddCo2(co2);
	console.log("CO2 : REGULAR PAGE LOAD DETECTED : " + window.location.host);
	console.log("CO2 : +" + co2 + " = " + _co2Count);
}

function PageLoaded()
{
	var host = window.location.host.toLowerCase();
	if(host.indexOf(".google.") > -1 && GetQueryStringInUrl("q")){
		GoogleSearch();
	}
	else{
		RegularPageLoaded();
	}

	if (!_isHtml5Video){
		if(	host.indexOf("stream") > -1 ||
			host.indexOf("netflix.") > -1 ||
			host.indexOf("hulu.") > -1){
			VideoStarted();
		}
		else if (	host.indexOf("deezer.") > -1 ||
					host.indexOf("soundcloud.") > -1){
			AudioStarted();
		}
	}
}

function InitCo2Detections()
{
	//html5 video
    var video = $('video');
	if(video.length > 0){
		_isHtml5Video = true;
		if(!video.paused && !_streaming){ //since the co2Count take some times to come from the storage, the video might be playing already
			VideoStarted()
		}
		video.on('playing', function(){
			if(!video.paused && !_streaming){
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
		_co2Count = obj.co2Count;
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