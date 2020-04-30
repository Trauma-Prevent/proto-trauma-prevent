.PHONY: run build install

run: build
	yarn start

build: install
	yarn run build-dep
	
install: 
	yarn run install-deps
