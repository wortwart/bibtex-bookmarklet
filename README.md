# bibtex-bookmarklet

Detects BibTeX data on web pages and manages them with an advanced bookmarklet

Background: [c't Magazin story about BibTeX](http://www.heise.de/ct/ausgabe/2016-1-Einfache-Wege-zu-einer-persoenlichen-BibTeX-Literaturdatenbank-3045068.html). The UI of the bookmarklet is in German.

## Usage

This bookmarklet was developed to collect BibTeX data on web pages. It lets you add, tag, edit, and remove BibTeX data, and export your collection. It automatically detects BibTeX code on the pages of the shop.heise.de website where you can access the c't archive, e.g. [this page](https://shop.heise.de/katalog/lesen-ohne-mitleser). It should be easily adaptible to other websites.

The bookmarklets are found in the "build" folder. There is an [install page](http://www.heise.de/extras/ct/1601/1601-158.html), but the code might be outdated.

## Bookmarklets?

In most modern browsers this happens completely locally. Data are stored in your localStorage. Only Internet Explorer has to insert externally hosted script code in the target page (from rawgit.com) because its URL size limit is too low - the full bookmarklet weighs over 10k.

This project shows what is possible when you combine bookmarks with modern building tools Node.js and Grunt. While bookmarklets are not very fashionable, they are still a powerful cross-platform technology that works in almost all browsers - whereas there is still no unified browser extension API.

##Notes

- If you paste the bookmarklet code into the address bar manually, you have to insert "javascript:" at the beginning. Most browsers strip this part for security reasons from copy/paste.

- The collected data are only accessible from within the domain where you saved them. This is a localStorage restriction.

- Be careful not to clean up your browsing data before you export your data as this might reset the localStorage.

- Bookmarklets don't work on pages blocking external scripts with a rigid [Content Security Policy](http://www.w3.org/TR/CSP/).

- Edge does not support bookmarklets, but there are workarounds.