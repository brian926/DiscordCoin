FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm Install
# Bundle app source
COPY . /usr/src/app

ENV MONGO_CONNECTION_STRING="mongodb://root:example@mongo:27017"

EXPOSE 8080
CMD [ "npm", "run", "start" ]