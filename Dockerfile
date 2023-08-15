FROM node:18-alpine
WORKDIR /app
COPY ./src ./
COPY .env ./
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/index.js"]