make: build
	
build: run
	
run:
	open ./index.html
server:
	python -m SimpleHTTPServer >/dev/null 2>&1 &

img:
	magick identify $i
	convert $i -background none -gravity South -extent 104x152 output.png
