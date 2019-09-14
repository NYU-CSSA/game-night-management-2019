# Game Night Web App
game night 2018 add red/blue teams, please revert the commit if you want to general function of create/operate players
please aquire an monogoDB and config the database url in config/database.js

Mlab is very handy: https://mlab.com/

Mlab is a popular nosql database service provided by mongoDB. but since February, 2019, mlab no longer allows new account creation, but the old ones still functions well. 

If the team needs to have access to the mlab account, please contact the previous administor. 
a quick guide to Mlab: https://www.youtube.com/watch?v=be1e5vmZCj4

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
$ npm start after edit config the correct mlab database url in config.js
```

## 3. Configuration (the first staff data has to be manually inserted)
```
1. check database.js // localhost or server
2. insert the first user through createPlayerScript / createStaff.js (node createStaff.js)
3. https://mlab.com/databases/   // for collections, an online database.
4. https://dashboard.heroku.com/apps // check heroku
```


## 4. Deploy to Heroku
```
$ cd [current-directory]
$ heroku login
$ heroku create [app-name]
$ git add .
$ git commit -am [commit-message]
$ git push heroku master
```


## Website:
By 2017:

https://nyucssa-gamenight.herokuapp.com/  
https://cssa-game-night.herokuapp.com/

2018: 

Management system: 
https://gamenight-leaderboard.herokuapp.com/ 

dashboard: 
https://nyucssa-fancy-leaderboard.herokuapp.com/

2019:

to be updated
