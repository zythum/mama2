var log     = require('./log')
var mamaKey = require('./mamakey')
var seeked  = require('./seeked')
var seekers = require('./seekers')
var matched

if (window[mamaKey] != true) {

	window[mamaKey] = true

	seekers.forEach(function (seeker) {
		if (matched === true) return
		if (!!seeker.match() === true)
			matched = true,
			seeker.getVideos(seeked)
	})

	if (matched === undefined) log('对不起，没有找到可以解析的内容', 2)

}