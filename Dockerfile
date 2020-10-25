# Step 1

FROM node:lts-alpine as build-step

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install

COPY . .

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn build

RUN rm -rf node_modules

# Step 2

FROM nginx:stable-alpine

COPY --from=build-step /app/build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf