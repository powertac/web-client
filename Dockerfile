FROM node:16-alpine AS build
WORKDIR /opt/powertac/web-client
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build-only

FROM node:16-alpine
WORKDIR /opt/powertac/web-client
RUN npm i -g http-server
COPY --from=build /opt/powertac/web-client/dist .
EXPOSE 80
ENTRYPOINT ["http-server", "/opt/powertac/web-client", "--port", "80"]
