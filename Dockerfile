FROM node:10

RUN npm install pm2 -g

ADD . /appDir
WORKDIR /appDir
ENV NODE_ENV production
CMD ["pm2-runtime", "./src/app.js"]
