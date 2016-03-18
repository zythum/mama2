var hasFlash = false;
try {
  var flashObject = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
  if (flashObject) {
    hasFlash = true;
  }
} catch (e) {
  if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] != undefined && 
    navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
    hasFlash = true;
  }
}
module.exports = hasFlash;