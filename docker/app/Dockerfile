FROM node:lts-stretch-slim

RUN apt-get update && apt-get dist-upgrade -y
RUN apt-get install -y build-essential

WORKDIR /opt/app

CMD ["node", "index.js"]
