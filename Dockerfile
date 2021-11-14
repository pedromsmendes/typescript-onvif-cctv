FROM node:14-alpine AS build

ARG CAM_HOST
ARG CAM_PORT
ARG CAM_USERNAME
ARG CAM_PASSWORD
ARG SEGMENTS_SEC
ARG DELETE_SEGMENTS_OLD_MINS
ARG DELETE_SEGMENTS_INTERVAL_MINS

WORKDIR /usr/src/app

COPY . .

RUN npm ci --no-audit

RUN npm run build

#Remove all dev packages
RUN npm prune --production --no-audit
RUN npm cache clean --force

# -- RUNTIME STAGE --------------------------------
FROM node:14-alpine AS runtime
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/build ./build

CMD [ "npm", "run", "start" ]