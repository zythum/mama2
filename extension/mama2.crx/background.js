chrome.browserAction.onClicked.addListener(function(){	
	chrome.tabs.getSelected(function(tab){
		chrome.tabs.executeScript(tab.id, {file: "content_script.js"});
	});
});