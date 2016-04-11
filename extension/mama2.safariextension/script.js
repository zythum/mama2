safari.self.addEventListener("message", function(theMessageEvent){
	var url = theMessageEvent.message;
	if(theMessageEvent.name == 'MAMA2'){
		if(window === window.top){
			(function(s){s=document.body.appendChild(document.createElement('script'));s.src=url+'?ts='+Date.now();s.charset='UTF-8';}())
		}
	}
}, false);
