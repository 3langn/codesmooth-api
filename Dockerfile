FROM ubuntu:22.04

ENV TZ=Asia/Ho_Chi_Minh

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update -y  \
 && apt-get install -y sudo  \
 && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash - 

RUN apt install -y nodejs 

RUN apt install golang-go -y


WORKDIR /app
COPY package*.json ./


RUN npm i
RUN npm install -g bun
COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm","run", "start:prod"]