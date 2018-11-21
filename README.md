# Game Night Web App
game night 2018 add red/blue teams, please revert the commit if you want to general function of create/operate players
please aquire an monogoDB and config the database url in config/database.js
Mlab is very handy: https://mlab.com/

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
$ git push heroku master
```


## Website:
By 2017:
https://nyucssa-gamenight.herokuapp.com/  
https://cssa-game-night.herokuapp.com/

2018: 
https://gamenight-leaderboard.herokuapp.com/
