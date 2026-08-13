FROM node:18
WORKDIR /app
COPY server/package*.json ./
## RUN npm install 
RUN npm install -g dorita980
COPY server/ .
EXPOSE 6565
CMD ["npm", "start"]
