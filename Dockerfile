FROM node:14

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --prefix client
RUN npm run build --prefix client
RUN npm install

ENV NODE_ENV=production

EXPOSE 5000

ENTRYPOINT ["npm", "run", "start"]
