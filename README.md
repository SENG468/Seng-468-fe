# Seng-468-fe
Front End for Seng 468 stock trading application

## To Run:
To run the development server, follow the steps below:
1. Navigate to the project root `/seng-468-fe`
2. npm install
3. To mock out the endpoints, change the value of `mockStockeTrader` in `src/api/api.js` to `true`
4. npm start
5. Application running on port 3000

## Run using Docker Compose:
This method doesn't not support hot reloading so for development, the above method is preferred.
1. Navigate to the project root `/seng-468-fe`
2. To build the container: $ docker-compose up -d --build
3. App should now be running on port 3001 (dev only, no production env yet)
4. To destroy the container: $ docker-compose stop

## Run using docker
This only packages dev mode. To package a prod release will be differnt
1. ```docker run -p 3000:3000 eetar1/stocktrade-ui```
2. The application is now running on localhost:3000

## Build a new image
1. ```docker build -t eetar1/stocktrade .```
2. ```docker push eetar1/stocktrade```
