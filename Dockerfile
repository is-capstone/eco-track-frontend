# Stage 1: Build the React application
FROM node:23.9.0 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules && npm install -f
COPY . .
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
