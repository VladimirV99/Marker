FROM node:14

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --prefix client
RUN npm run build --prefix client
RUN npm install

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE $PORT

ENTRYPOINT ["npm", "run", "start"]
