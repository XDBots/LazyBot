FROM node:16-buster-slim
RUN apt update && apt upgrade -y && apt install openssl -y
COPY . /lazybot
WORKDIR /lazybot
RUN yarn install
RUN yarn build
RUN rm -rf src
CMD ["yarn", "run", "start"]