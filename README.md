# Migo, your best friend, always with you

## Description
- This web app is aimed at helping pet's owners to keep records of medical or events about their pet.
- The name Migo comes from the pun made from amigo and conmigo which means friend and with me in spanish.
  It started as a bootcamp final project between 3 students and I choose to pursue the development.  
- At the moment, you can create any pet profile you want with one image and basic details (date of birth weight, breed) and create event records.
- A AI agent can be consulted to get advices about your pet's health or education.

## Instructions

- The app is built with Flask, SQLalchemy for the backend and React for the frontend.
  You can connect with a sqlite, mysql or postgresql database.  
  You need Python3.13 and NodeJS 22 at least.
  
- To install the dependencies, run
  `$ pipenv install` to install the backend
  `$ cp .env.example .env` then fill it (`$ nano .env`) 
  `$ npm install` to install the frontend
- To populate the database with the fields (for sqlite, you don't have to create a blank database, for the others, yes), run
  `$ pipenv run init`
  `$ pipenv run migrate` 
  `$ pipenv run upgrade` 
- To launch the app, run in 2 terminals:
  `$ pipenv run start` (for the backend server)  
  `$ npm run start` (for the frontend server)


Based on 4Geeks's boilerplate with React JS and Flask API

- Documentation can be found here: https://4geeks.com/docs/start/react-flask-template

Exemples to fill the db path in the .env
| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |


### Contributors

The template was built as part of the 4Geeks Academy [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) by [Alejandro Sanchez](https://twitter.com/alesanchezr) and many other contributors.
The initial project was made by [ValenLopezVega](https://github.com/ValenLopezVega) [danigraphic](https://github.com/danigraphic) and [myself](https://github.com/elebar15)
