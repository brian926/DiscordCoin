FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# Bundle app source
COPY . /usr/src/app

ENV MONGO_CONNECTION_STRING="mongodb://root:example@mongo:27017"

## Wait Tool
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 8080
CMD /wait && npm run start