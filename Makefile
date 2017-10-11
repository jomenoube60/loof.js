LIBFILES=$(wildcard lib/*.js)

main.js: ${LIBFILES}
	echo '"use strict"' > $@
	cat $^ >> $@
