FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm install
COPY . .
RUN npm run build --workspace client
EXPOSE 5001 5173
CMD ["npm", "run", "dev"]
