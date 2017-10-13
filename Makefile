LIBFILES=$(wildcard lib/*.js)

serve: main.js index.html
	python -m http.server

main.js: ${LIBFILES}
	echo '"use strict"' > $@
	cat $^ >> $@
