FROM node:23-alpine3.20
WORKDIR /src
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
