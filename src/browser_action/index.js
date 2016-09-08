

$(function()
{  
  Init();
  $("#btnReset").click(function(){ ResetCo2Count(); });
});

function Init()
{
  chrome.storage.local.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveToLocalStorage("co2Count", obj.co2Count); }
		var co2Count = obj.co2Count;
		 $("#co2-count").html(parseInt(co2Count));     
     DisplayEquivalences(co2Count)
	});	

  chrome.storage.local.get("lastReset", function (obj) { 
    if(isNaN(obj.lastReset)){ obj.lastReset = Date.now(); SaveToLocalStorage("lastReset", obj.lastReset); }
    DisplayLastReset(obj.lastReset);
  });
}

function ResetCo2Count()
{
  SaveToLocalStorage("co2Count", 0);
  SaveToLocalStorage("lastReset", Date.now());
  Init();
}

function DisplayEquivalences(co2User)
{  
  $("#equi1").html(
    FormatEquivalence(co2User, /*250.0*/ 150.0, 2, "<b>[v] km</b> de voiture", "car3") +
    
    
    FormatEquivalence(co2User, 85.0, 2, "<b>[v] km</b> en avion <abbr title=\"Prendre l'avion consomme beaucoup plus que la voiture \ncar le nombre de km effectués est beaucoup plus important\">par personne</abbr> <i class='material-icons'>&#xE195;</i>") +
    FormatEquivalence(co2User, 8.0, 0, "<b>[v] h</b> d'ampoule allumée en France <i class=\"material-icons\">&#xE42E;</i>") /*    
    FormatEquivalence(co2User, 15000.0 / 900.0 , 1, "<b>[v] kg</b> de glace fondue", "ice1") +
    FormatEquivalence(co2User, 1000.0 / 24.0, 1, "<b>[v] h</b> de respiration humaine", "hum1")*/
  );
  /*$("#equi2").html(
    // FormatEquivalence(co2User, 85.0, 2, "<b>[v] km</b> en avion par personne") +
     FormatEquivalence(co2User, 2.6, 0, "Frigo allumé pendant <b>[v] h</b> en France") +
     FormatEquivalence(co2User, 46.6, 0, "Incinération de <b>[v] kg</b> de papier en France") // +
    //FormatEquivalence(co2User, 29.0, 0, "<b>[v] h</b> d'ampoule allumée en Europe")
  );*/
}

/*
100km en voiture essence consommant 6l/100km
Emission de 15 kg d’équivalent CO2
Soit 15x60=900kg de glace soit 1m3 de glace 
*/

function FormatEquivalence(co2User, co2Base, decimals, text, img)
{
  var value = co2User / co2Base;
  if (decimals === 0){
    value = parseInt(value);
  }
  else{
    value = parseFloat(value).toFixed(decimals);
  }
  if(img){
    text += " <img src=\"../../icons/" + img + ".png\" height=\"18px\"/>";
  }
  return "<li>"+ text.replace("[v]", value) + "</li>";
}

function SaveToLocalStorage(key, value)
{
	var obj = {};
	obj[key] = value;
	chrome.storage.local.set(obj, function() {
		console.log('local storage \"' + key + '\" saved with value :');
    console.log(value);
	});
}

function DisplayLastReset(date)
{
  $("#lastReset").html(GetFormattedDate(new Date(date)));
}

function GetFormattedDate(date) 
{
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = ("0" + date.getMinutes()).slice(-2);
    return day + "/" + month + "/" + year + " à " + hours + ":" + minutes;
}
