LIBFILES=$(wildcard lib/*.js)

main.js: ${LIBFILES}
	echo '"use strict"' > $@
	cat $^ >> $@

tidy:
	./node_modules/js-beautify/js/bin/js-beautify.js -r lib/*.js

install: main.js
	scp -r $^ index.html img planet:www/loof/js/

tags: main.js
	jsctags -f lib/*.js | LC_ALL=C sort > tags
