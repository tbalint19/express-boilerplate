FROM node:10

RUN npm install pm2@latest -g

ADD . /appDir
WORKDIR /appDir

# CMD ["npm", "run", "migrate"]
CMD ["pm2-runtime", "start", "demo-app.sh"]

EXPOSE 3000
