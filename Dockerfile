# pull official base image
FROM node:14

# set working directory
WORKDIR /seng-468-fe

# add `/app/node_modules/.bin` to $PATH
ENV PATH /seng-468-fe/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
