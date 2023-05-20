FROM node:16-alpine AS build
WORKDIR /opt/powertac/web-client
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build-only

FROM nginx
COPY --from=build /opt/powertac/web-client/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
