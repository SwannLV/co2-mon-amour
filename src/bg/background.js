// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });*/

var img = new Image();
img.onload = function () {
  LoadIcon();
}
img.src = "../../icons/icon19.png";

function LoadIcon(){
  var canvas = document.createElement('canvas');
  canvas.id     = "CursorLayer";
  canvas.width  = 19;
  canvas.height = 19;
  canvas.style.zIndex   = 8;
  canvas.style.position = "absolute";
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  var imageData = context.getImageData(0, 0, 19, 19);
  chrome.browserAction.setIcon({
    imageData: imageData
  });
}