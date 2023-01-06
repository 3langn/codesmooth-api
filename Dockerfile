FROM ubuntu:22.04

RUN apt update -y  \
 && apt install -y sudo

RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash - 

RUN apt install -y nodejs 

RUN apt install golang-go -y


WORKDIR /app
COPY package*.json ./


RUN npm i

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]