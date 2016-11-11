var baseURL = '//woerter.de/bibtex/';
var head = document.getElementsByTagName('head')[0];
if (!document.getElementById('bibtexScript')) {
	var script = document.createElement('script');
	script.src = baseURL + 'bibtex.js';
	script.id = 'bibtexScript';
	head.appendChild(script);
}