FROM node:16-buster-slim
RUN apt update && apt upgrade -y && apt install openssl git neofetch -y
RUN npm install pm2 -g
COPY . /lazybot
WORKDIR /lazybot
RUN yarn install
RUN yarn build
CMD ["pm2-runtime", "start", "ecosystem.config.js"]