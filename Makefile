override PORT=3000

install1: clean
	echo Node vesion / NPM version
	node -v && npm -v
	cd level1 && npm i && npm run build && PORT=${PORT} npm start

install2: clean
	echo Node vesion / NPM version
	node -v && npm -v
	cd level2 && npm i && npm run build && PORT=${PORT} npm start

clean:
	#kill -9 `lsof -t -i:3000`
	cd level1 && rm -rf ./build
	cd level2 && rm -rf ./build
