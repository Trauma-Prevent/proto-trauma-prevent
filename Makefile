.PHONY: clean restart restart_force start run build install

build: install
	yarn run build-dep
	
install: 
	yarn run install-deps

run: build
	yarn start

start: 
	docker-compose up

restart:
	docker-compose up --force-recreate

restart_force: 
	docker-compose build
	docker-compose up

clean:
	git checkout lib/tetris/build pages/tetris.html
	git clean -f
	rm -rf node_modules/ lib/tetris/node_modules/ 

