# bibtex-bookmarklet

Detects BibTeX data on web pages and manages them with an advanced bookmarklet

Background: [c't Magazin story about BibTeX](http://www.heise.de/ct/ausgabe/2016-1-Einfache-Wege-zu-einer-persoenlichen-BibTeX-Literaturdatenbank-3045068.html). The UI of the bookmarklet is in German.

## Usage

This bookmarklet was developed to collect BibTeX data on web pages. It lets you add, tag, edit, and remove BibTeX data, and export your collection. It automatically detects BibTeX code on the pages of the heise.de website, e.g. [this page](https://shop.heise.de/katalog/lesen-ohne-mitleser). It should be easily adapted to other websites. The bookmarklets are found in the "build" folder.

## Bookmarklets?

In most modern browsers this happens completely locally. Only Internet Explorer has to insert externally hosted script code in the target page (right here from github.com) because its URL size limit is too low - the full bookmarklet weighs over 10k.

While bookmarklets are not very fashionable, they are still a powerful cross-platform technology that works in almost all browsers - Edge being the most significant exception (but there are workarounds). This project shows what is possible when you combine bookmarks with modern building tools Node.js and Grunt.

*Note:* If you paste the bookmarklet code into the address bar manually, you have to insert "javascript:" at the beginning. Most browsers strip this part for security reasons from copy/paste.