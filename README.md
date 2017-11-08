# Game Night Web App

## 1. Software Preparation
```
mongodb
mlab
heroku
```

## 2. Localhost
```sh
$ git clone git@github.com:NYU-CSSA/game-night.git
$ cd game-night
$ npm install
$ mongod // start mongo service
$ npm start // run index.js
```

## 3. Configuration
```
1. check database.js // localhost or server
2. insert the first user through test.js
3. https://mlab.com/databases/   // for collections, an online database.
4. https://dashboard.heroku.com/apps // check heroku
```


## 4. Deploy to Heroku
```
$ heroku login
$ heroku git:clone -a cssa-game-night
$ cd cssa-game-night
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```


## Website:
https://nyucssa-gamenight.herokuapp.com/
https://cssa-game-night.herokuapp.com/