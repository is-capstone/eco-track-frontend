# Stage 1: Build the React application
FROM node:23.9.0 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules && npm install -f
COPY . .
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80/tcp
CMD ["nginx", "-g", "daemon off;"]
