var	style, box;

if (localStorage === undefined) {
	alert('Die für das BibTeX-Bookmarklet notwendige Speichertechnik localStorage funktioniert nicht. Haben Sie eine Webseite geöffnet? Arbeiten Sie mit einem sehr alten Browser?');
}

if (!bbt.close()) {
	style = document.querySelector('style');
	if (!style) {
		style = document.createElement('style');
		document.head.appendChild(style);
	}
	style.innerHTML += 'InlineCssPlaceholder';
}

box = '<div id="' + bbt.ns + '">';
box += '<p id="' + bbt.ns + 'Close"><button onclick="bbt.close()">Schließen</button></p>';

bbt.savedDataQuery();

box += '<div id="' + bbt.ns + 'Form">'
if (!bbt.savedData || !bbt.bibtexQuery) box += bbt.displayForm();
box += '</div>'

box += '<div id="' + bbt.ns + 'Status">';
if (bbt.bibtexQuery) {
	if (bbt.savedData)
		box += bbt.status('dataExisting');
	else
		box += bbt.status('bibtexInPage');
} else {
	box += bbt.status('noBibtexInPage');
}
box += '</div>';

box += '<div id="' + bbt.ns + 'Data">';
box += bbt.datasetOutput();
box += '</div>';

box += '<section id="' + bbt.ns + 'ListBox" class="bbtHidden">';
box += '<h3>Alle BibTeX-Datensätze für ' + location.host + '</h3>';
box += '<ul id="' + bbt.ns + 'List">';
bbt.listOutput();
box += '</ul></section>';

box += '<hr/><p id="' + bbt.ns + 'Buttons">';
box += '<button onclick="return bbt.toggleList();">' + bbt.toggleButton.showText + '</button> ';
box += '<button onclick="return bbt.info();">i</button>';
box += '<button onclick="return bbt.export();">Exportieren</button>';
box += '</p>';

box += '</div>';
window.document.body.innerHTML += box;
