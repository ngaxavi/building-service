FROM node:12-slim as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:12-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
CMD npm run start:prod
