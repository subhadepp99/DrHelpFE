FROM node:18-alpine

WORKDIR /app

COPY . ./
RUN npm install --legacy-peer-deps

# Skip build step and serve directly in dev mode
CMD ["npm", "run", "dev"]
