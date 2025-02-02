FROM node:23-alpine3.20
WORKDIR /src
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 4000
CMD [ "node", "dist/src/index.js" ]