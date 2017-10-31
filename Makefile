LIBFILES=$(wildcard lib/*.js)

main.js: ${LIBFILES}
	./node_modules/webpack/bin/webpack.js

tidy:
	./node_modules/js-beautify/js/bin/js-beautify.js -r lib/*.js

install: main.js
	scp -r $^ index.html img planet:www/loof/js/

tags: main.js
	./node_modules/jsctags/bin/jsctags -f lib/*.js | LC_ALL=C sort > tags

watch:
	./node_modules/webpack/bin/webpack.js --watch

dist:
	./node_modules/webpack/bin/webpack.js --config webpack.dist-config.js
	scp main.js planet:www/loof/js/
