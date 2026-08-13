FROM node:18-slim
WORKDIR /app
COPY server/package*.json ./
## RUN npm install 
RUN npm install && npm install -g dorita980
COPY server/ .
EXPOSE 6565
CMD ["npm", "start"]
