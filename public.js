var bbt = {
	ns: 'bibTexBookmarklet',
	suffix: '|bbtsave|',
	ls: localStorage,
	url: document.location.href.split('?')[0],
	bibtexQuery: document.querySelector('.bibtex-info'),
	savedData: false,

	toggleButton: {
		showText: 'Liste anzeigen',
		hideText: 'Liste verbergen'
	},

	getBox: function() {
		return document.getElementById(this.ns);
	},

	displayForm: function() {
		var _formBox = document.getElementById(this.ns + 'Form'), bbtForm;
		bbtForm = '<form action="#" onsubmit="return bbt.save();">';
		if (this.bibtexQuery) {
			bbtForm += '<input type="hidden" name="bibtexCode" value="' + this.bibtexQuery.innerHTML + '"/>';
		} else
			bbtForm += '<textarea rows="4" name="bibtexCode" placeholder="BibTeX-Code eingeben"></textarea>';
		bbtForm += '<input name="bibtexNotes" placeholder="Stichworte (optional)"/>';
		bbtForm += '<input type="submit" value="Speichern"/>';
		bbtForm += '</form>';
		if (_formBox)
			_formBox.innerHTML = bbtForm;
		else
			return bbtForm;
	},

	close: function() { // called from HTML
		var box = this.getBox();
		if (!box) return false;
		document.body.removeChild(box);
		return true;
	},

	save: function(value) { // called from HTML
		var _form = document.querySelector('#' + this.ns + ' form'),
			_fields = _form.querySelectorAll('input, textarea'),
			data = {
				Datum: Date.now()
			},
			urlSuffix = this.bibtexQuery? '' : this.suffix + data.Datum;
		for (var i = 0; i < _fields.length; i++) {
			if (_fields[i].type === 'submit') continue;
			if (!_fields[i].value) continue;
			var _fname = _fields[i].name.replace('bibtex', '');
			data[_fname] = _fields[i].value;
		}
		if (!Object.keys(data).length) {
			this.status('noDataToSave');
			return false;
		}
		this.ls.setItem(this.ns + this.url + urlSuffix, JSON.stringify(data));
		this.savedDataQuery();
		this.status('saved');
		this.datasetOutput();
		this.listOutput();
		return false;
	},

	'delete': function(key) { // called from HTML
		this.ls.removeItem(key);
		this.savedDataQuery();
		if (!this.savedData || !this.bibtexQuery) this.displayForm();
		this.status('deleted', this.urlInKey(key, true));
		this.datasetOutput();
		this.listOutput();
		return false;
	},

	toggleList: function() { // called from HTML
		var toggleButton = document.querySelector('#' + this.ns + 'Buttons button');
		var dataList = document.getElementById(this.ns + 'ListBox');
		if (dataList.classList.contains('bbtHidden')) {
			this.listOutput();
			dataList.classList.remove('bbtHidden');
			toggleButton.innerHTML = this.toggleButton.hideText;
		} else {
			dataList.classList.add('bbtHidden');
			toggleButton.innerHTML = this.toggleButton.showText;
		}
		this.status();
		return false;
	},

	savedDataQuery: function() {
		for (var i = 0; i < this.ls.length; i++) {
			var k = this.ls.key(i);
			if (k.indexOf(this.ns + this.url) >= 0) {
				this.savedData = this.ls.getItem(k);
				return;
			}
		}
		this.savedData = false;
	},

	// extracts URL from storage key
	urlInKey: function(key, withoutHttp) {
		if (!key) return;
		if (key.indexOf(this.ns) < 0) return;
		key = key.replace(this.ns, '');
		if (withoutHttp) key = key.replace(/^http(?:s)?:\/\//, '');
		var kSplit = key.split(this.suffix);
		return kSplit[0];
	},

	outputDate: function(timestamp) {
		var date = new Date(timestamp);
		var monthnames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
		return date.getDay() + '.' + monthnames[date.getMonth()] + ' ' + date.getFullYear() + ', ' + date.getHours() + ':' + ("0" + date.getMinutes()).substr(-2);
	},

	status: function(type, arg) {
		var _status = document.getElementById(this.ns + 'Status'), msg;
		if (!type) type = 'default';
		switch(type) {
			case 'dataExisting': msg = 'Die BibTeX-Daten für diese Seite sind bereits gespeichert.'; break;
			case 'bibtexInPage': msg = 'BibTeX-Daten auf dieser Seite gefunden.'; break;
			case 'noBibtexInPage': msg = 'Keine BibTeX-Daten auf dieser Seite gefunden.'; break;
			case 'noDataToSave': msg = 'Sie haben keine Daten zum Speichern eingegeben.'; break;
			case 'saved': msg = 'BibTeX-Daten wurden gespeichert.'; break;
			case 'deleted': msg = 'Datensatz für ' + arg + ' wurde gelöscht.'; break;
			case 'default': msg = '';
		}
		if (_status)
			_status.innerHTML = '<p>' + msg + '</p>';
		return '<p>' + msg + '</p>';
	},

	datasetRead: function(key, datesort, html) {
		var _data, data, k, datum, output = [];
		if (!this.savedData && !key) return output;
		if (key)
			_data = this.ls.getItem(key);
		else {
			_data = this.savedData;
			key = this.ns + this.url;
		}
		data = JSON.parse(_data);
		k = Object.keys(data);
		for (var i = 0; i < k.length; i++) {
			var val = data[k[i]];
			if (k[i] === 'Datum') {
				datum = val;
				val = this.outputDate(datum);
			}
			var field = html?
				'<b>' + k[i] + '</b>: ' + val :
				k[i] + ': ' + val.replace(/\s+$/, '').replace(/[\n\r]+/g, '%0A');
			output.push(field);
		}
		if (!output.length) return output;
		if (datesort) output.unshift(datum);
		if (html) output.push('<button onclick="return bbt.delete(\'' + key + '\')">Datensatz Löschen</button>');
		return output;
	},

	datasetOutput: function() {
		var _outputBox = document.getElementById(this.ns + 'Data'),
			dataset = [],
			output = '<p>',
			items = {},
			itemKeys = [];
		if (this.bibtexQuery) {
			items['single'] = this.datasetRead(false, false, true);
			if (items['single'].length === 0) delete items['single'];
		} else
			items = this.datasetsOutput(false, true);
		itemKeys = Object.keys(items);
		if (!itemKeys.length) {
			output += 'Keine BibTeX-Daten auf dieser Seite gespeichert.';
		} else if (itemKeys.length === 1) {
			output += '<b>Auf dieser Seite gespeicherter Datensatz:</b><br/>';
			dataset = items[itemKeys[0]];
			output += dataset.join('<br/>');
		} else
			output += '<b>' + itemKeys.length + ' BibTeX-Datensätze</b> auf dieser Seite gespeichert';
		output += '</p>';
		if (_outputBox)
			_outputBox.innerHTML = output;
		return output;
	},

	datasetsOutput: function(withLink, thisPageOnly) {
		var items = {};
		for (var i = 0; i < this.ls.length; i++) {
			var key = this.ls.key(i), page, item, datum, lClass = '';
			page = this.urlInKey(key);
			if (!page) continue;
			item = this.datasetRead(key, true, withLink);
			datum = item.shift();
			if (thisPageOnly) {
				if (page !== this.url) continue;
			} else {
				if (page === this.url) lClass = ' class="bbtThisPage"';
			}
			if (withLink)
				item.unshift('<a href="' + page + '" ' + lClass + '>' + this.urlInKey(key, true) + '</a>');
			else
				item.unshift(page);
			items[datum] = item;
		}
		return items;
	},

	listOutput: function() {
		var _outputList = document.getElementById(this.ns + 'List'), output = '';
		var items = this.datasetsOutput(true);
		var sorted = Object.keys(items).sort().reverse();
		sorted.forEach(function(key) {
			output += '<li>' + items[key].join('<br/>') + '</li>';
		});
		if (!output) output = '<li>Noch keine Daten gespeichert.</li>';
		if (_outputList)
			_outputList.innerHTML = output;
		return output;
	},

	export: function() { // called from HTML
		var output = '';
		var items = this.datasetsOutput(false);
		var sorted = Object.keys(items).sort();
		sorted.forEach(function(key) {
			output += items[key].join('%0A') + '%0A%0A';
		});
		if (this.ls.getItem('bbtExportAlert') === null) {
			alert('Bitte speichern Sie den Inhalt des Popup-Fensters (z.B. mit Ctrl+S oder über das Kontextmenü), das sich gleich öffnen wird, um Ihre Daten zu sichern.');
			this.ls.setItem('bbtExportAlert', 1);
		}
		var popup = this.popup('bbtexport', 'plain', output);
		return false;
	},

	popup: function(name, type, content) {
		return window.open('data:text/' + type + ';charset=utf-8,' + content, name, 'width=270,height=350,top=100,left=' + (window.innerWidth - 250) + ',dependent=yes');
	},

	info: function() { // called from HTML
		var output = '<h3>BibTeX-Bookmarklet</h3>';
		output += '<p>Dieses Bookmarklet ist dafür gedacht, auf Webseiten gefundenen <a href="https://de.wikipedia.org/wiki/BibTeX">BibTeX-Code</a> zu speichern und gesammelte Daten als Liste auszugeben. Wenn Sie das Bookmarklet zum Erfassen von c\'t-Artikeln anhand einer Suche im heise-Shop nutzen, wird der Code auf Knopfdruck automatisch übernommen und die Software prüft, ob Sie diese Fundstelle kurz zuvor schon einmal erfasst haben. Von anderen Seiten aus müssen Sie den BibTeX-Code selbst, zum Beispiel per Cut&amp;Paste in das Pop-up übertragen.</p>';
		output += '<p><b>Achtung:</b> Das BibTeX-Bookmarklet speichert die Daten nur in Ihrem Browser. Daher können Sie nur auf Daten von Seiten zugreifen, die innerhalb der gerade geöffneten Domain liegen. Um die versehentliche Löschung der Daten zu vermeiden, sollten Sie die Daten über den Button <q>Exportieren</q> im Pop-up des Bookmarklets regelmäßig als Textdatei auf Festplatte sichern.</p>'
		this.popup('bbtinfo', 'html', output);
		return false;
	}
};
void(0);