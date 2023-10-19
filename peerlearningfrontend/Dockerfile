FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install @reduxjs/toolkit
RUN npm install react-redux
RUN npm install --save recharts

COPY . .

CMD [ "npm", "start" ]
