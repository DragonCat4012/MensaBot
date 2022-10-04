# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat=1.2.2-r7
WORKDIR /bot
COPY package*.json ./
RUN npm ci -q



# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /bot

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

COPY --from=deps /bot/package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY --from=deps /bot/node_modules ./node_modules
COPY ./src ./src
COPY ./*.json ./

CMD [ "npm",  "start" ]
