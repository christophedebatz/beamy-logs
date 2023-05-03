override PORT=3000

install1: clean
	echo Node vesion / NPM version
	node -v && npm -v
	cd level1 && npm i && npm run build && PORT=${PORT} npm start

clean:
	#kill -9 `lsof -t -i:3000`
	cd level1 && rm -rf ./build
	cd level1 && rm -rf ./build
