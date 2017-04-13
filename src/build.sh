#/bin/sh
#npm i gulp --save-dev
#npm i gulp-sass --save-dev
#npm install gulp-imagemin --save-dev
#npm install del --save-dev
#npm install --save-dev gulp-mustache
#npm install --save-dev gulp-typescript typescript
#npm install --save-dev gulp-minify
#npm install --save-dev gulp-chmod 
#npm install --save-dev http-server
npm install
gulp develop &
http-server -c-1 dist/ 
