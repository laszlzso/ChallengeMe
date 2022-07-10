FROM node:18.5.0

WORKDIR /app

ENV PORT 80

COPY package.json ./package.json

RUN npm install

COPY . .

CMD ["npm", "start"]
