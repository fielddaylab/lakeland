# Builds Lakeland for the Vault CDN into dist/.
# CI (.github/workflows/publish.yml) runs `make build` and publishes dist/ to
# builds.vaultlearninggames.org/fieldday/lakeland/<branch>/.

OUT := dist

# Repo files that aren't part of the game.
EXCLUDES := --exclude /.git --exclude /.github --exclude .gitignore --exclude .DS_Store --exclude /$(OUT) \
	--exclude '/[Mm]akefile' --exclude /README.md --exclude /rsync-exclude --exclude /docs

.PHONY: build clean run server

build:
	rm -rf $(OUT) && mkdir -p $(OUT)
	rsync -a $(EXCLUDES) ./ $(OUT)/
	@echo "Built Lakeland into $(OUT)/"

clean:
	rm -rf $(OUT)

# Local play: open the game, or serve it at http://localhost:8000
run:
	open ./index.html

server:
	python3 -m http.server 8000

# Pad a sprite to 104x152: make img i=path/to/image.png
img:
	magick identify $(i)
	convert $(i) -background none -gravity South -extent 104x152 output.png
