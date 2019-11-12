# Game Night Web App

## 2019 updates

* uses mongoDb to store information of staffs and players
* remove player teams, add player nicknames and NetId

## 1. Software Preparation
```
mongodb
heroku
```

## 2. Localhost
```sh
$ git clone https://github.com/NYU-CSSA/game-night-management-2019
$ cd game-night-management-2019
$ npm install
$ npm start after add the .env file
```

## 3. Configuration (the first staff data has to be manually inserted)
```
1. add .env file // localhost or server
2. insert the first user through createPlayerScript / createStaff.js (node createStaff.js)
3. go to mongoDB Atlas // for collections, an online database.
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

Management system: 
https://game-night-management.herokuapp.com/

dashboard: 
under construction