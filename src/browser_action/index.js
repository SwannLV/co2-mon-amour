

$(function(){
  
  chrome.storage.local.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveCo2Count(obj.co2Count); }
		var co2Count = obj.co2Count;
		 $("#co2-count").html(parseInt(co2Count));     
     DisplayEquivalences(co2Count)
	});	

});

function DisplayEquivalences(co2User)
{  
  $("#equi").html(
    FormatEquivalence(co2User, 250.0, 2, "<b>[v] km</b> en voiture") +
    FormatEquivalence(co2User, 85.0, 2, "<b>[v] km</b> en avion par personne") +
    FormatEquivalence(co2User, 2.6, 0, "Frigo allumé pendant <b>[v] h</b> en France") +
    FormatEquivalence(co2User, 46.6, 0, "Incinération de <b>[v] kg</b> de papier en France") +
    FormatEquivalence(co2User, 8.0, 0, "Une ampoule allumée durant <b>[v] h</b> en France") +
    FormatEquivalence(co2User, 29.0, 0, "Une ampoule allumée durant <b>[v] h</b> en Europe")
  );
}

function FormatEquivalence(co2User, co2Base, decimals, text)
{
  var value = co2User / co2Base;
  if (decimals === 0){
    value = parseInt(value); 
  }
  else{
    value = parseFloat(value).toFixed(decimals)
  }
  return "<li>"+ text.replace("[v]", value) + "</li>";
}