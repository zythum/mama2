var url = 'http://zythum.sinaapp.com/mama2/dest/index.js'
if(window === window.top){
	(function(s){s=document.body.appendChild(document.createElement('script'));s.src=url+'?ts='+Date.now();s.charset='UTF-8';}())
}