(function() {
	var ls = localStorage;
	var ns = 'Bibi:';
	ls.setItem(ns + Date.now(), document.location.href);
	for (var i = 0; i < ls.length; i++) {
		var k = ls.key(n);
		if (k.indexOf(ns) < 0) continue;
		console.log(k.substr(ns.length) + ': ' + ls.getItem(k));}
})();