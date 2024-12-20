deploy:
	rsync -vrc * mli-field@fielddaylab.wisc.edu:/httpdocs/play/lakeland/game --exclude-from rsync-exclude

deploy-test:
	rsync -vrc * mli-field@fielddaylab.wisc.edu:/httpdocs/play/lakeland/test --exclude-from rsync-exclude

make: build
	
build: run
	
run:
	open ./index.html
server:
	python -m SimpleHTTPServer >/dev/null 2>&1 &

img:
	magick identify $i
	convert $i -background none -gravity South -extent 104x152 output.png
