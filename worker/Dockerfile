###############################################################################
# The builder image, used to build the virtual environment
###############################################################################

FROM node:lts-alpine3.20 AS builder

WORKDIR /libs/caidense-reasoning

COPY libs/caidense-reasoning/package*.json ./
COPY libs/caidense-reasoning/tsconfig*.json ./
COPY libs/caidense-reasoning/src ./src

RUN npm ci

WORKDIR /app

COPY worker/package*.json ./
COPY worker/tsconfig*.json ./
COPY worker/src ./src

RUN npm ci
RUN npm run build

###############################################################################
# The runtime image, used to just run the code provided its virtual environment
###############################################################################

FROM node:lts-alpine3.20 AS runtime

COPY --from=builder /libs/caidense-reasoning/node_modules /libs/caidense-reasoning/node_modules
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

WORKDIR /app

EXPOSE 3000

CMD [ "node", "dist/app/src/main" ]
