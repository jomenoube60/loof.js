LIBFILES=$(wildcard lib/*.js)

main.js: ${LIBFILES}
	echo '"use strict"' > $@
	cat $^ >> $@

tidy:
	./node_modules/js-beautify/js/bin/js-beautify.js -r lib/*.js
