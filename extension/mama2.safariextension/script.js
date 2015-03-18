var url = 'http://localhost:8000/dest/index.js'
safari.self.addEventListener("message", function(theMessageEvent){
	if(theMessageEvent.name == 'MAMA2'){
		if(window === window.top){
			(function(s){s=document.body.appendChild(document.createElement('script'));s.src=url+'?ts='+Date.now();s.charset='UTF-8';}())
		}
	}
}, false);
