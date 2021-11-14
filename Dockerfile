FROM node:14-alpine AS build

ARG CAM_HOST
ARG CAM_PORT
ARG CAM_USERNAME
ARG CAM_PASSWORD
ARG SEGMENTS_SEC
ARG DELETE_SEGMENTS_OLD_MINS
ARG DELETE_SEGMENTS_INTERVAL_MINS

WORKDIR /app

COPY . .

RUN npm ci --no-audit

RUN npm run build

#Remove all dev packages
RUN npm prune --production --no-audit
RUN npm cache clean --force

# -- RUNTIME STAGE --------------------------------
FROM node:14-alpine AS runtime
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build

CMD [ "npm", "run", "start" ]