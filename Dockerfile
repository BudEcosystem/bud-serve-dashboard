# Stage 1: Install dependencies
FROM node:lts-alpine AS deps

WORKDIR /usr/bin/src

# Install dependencies based on the package.json and yarn.lock files
COPY package.json ./
RUN yarn install --frozen-lockfile

# Stage 2: Build the application
FROM node:lts-alpine AS builder

WORKDIR /usr/bin/src

# Copy the dependencies from the previous stage
COPY --from=deps /usr/bin/src/node_modules ./node_modules

# Copy the rest of the application files
COPY . .

# Environment variable placeholders (can be overridden at runtime)
ENV NEXT_PUBLIC_BASE_URL=NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_VERCEL_ENV=NEXT_PUBLIC_VERCEL_ENV
ENV NEXT_PUBLIC_PASSWORD=NEXT_PUBLIC_PASSWORD
ENV NEXT_PUBLIC_PRIVATE_KEY=NEXT_PUBLIC_PRIVATE_KEY
ENV NEXT_PUBLIC_NOVU_SOCKET_URL=NEXT_PUBLIC_NOVU_SOCKET_URL
ENV NEXT_PUBLIC_NOVU_BASE_URL=NEXT_PUBLIC_NOVU_BASE_URL
ENV NEXT_PUBLIC_NOVU_APP_ID=NEXT_PUBLIC_NOVU_APP_ID
ENV NEXT_PUBLIC_TEMP_API_BASE_URL=NEXT_PUBLIC_TEMP_API_BASE_URL
ENV NEXT_PUBLIC_COPY_CODE_API_BASE_URL=NEXT_PUBLIC_COPY_CODE_API_BASE_URL
ENV NEXT_PUBLIC_PLAYGROUND_URL=NEXT_PUBLIC_PLAYGROUND_URL
ENV NEXT_PUBLIC_ASK_BUD_URL=NEXT_PUBLIC_ASK_BUD_URL
ENV NEXT_PUBLIC_ASK_BUD_MODEL=NEXT_PUBLIC_ASK_BUD_MODEL


# Create a .env file from the ENV variables
RUN echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env && \
    echo "NEXT_PUBLIC_VERCEL_ENV=$NEXT_PUBLIC_VERCEL_ENV" >> .env && \
    echo "NEXT_PUBLIC_PASSWORD=$NEXT_PUBLIC_PASSWORD" >> .env && \
    echo "NEXT_PUBLIC_PRIVATE_KEY=$NEXT_PUBLIC_PRIVATE_KEY" >> .env && \
    echo "NEXT_PUBLIC_NOVU_SOCKET_URL=$NEXT_PUBLIC_NOVU_SOCKET_URL" >> .env && \
    echo "NEXT_PUBLIC_NOVU_BASE_URL=$NEXT_PUBLIC_NOVU_BASE_URL" >> .env && \
    echo "NEXT_PUBLIC_NOVU_APP_ID=$NEXT_PUBLIC_NOVU_APP_ID" >> .env && \
    echo "NEXT_PUBLIC_TEMP_API_BASE_URL=$NEXT_PUBLIC_TEMP_API_BASE_URL" >> .env && \
    echo "NEXT_PUBLIC_COPY_CODE_API_BASE_URL=$NEXT_PUBLIC_COPY_CODE_API_BASE_URL" >> .env && \
    echo "NEXT_PUBLIC_PLAYGROUND_URL=$NEXT_PUBLIC_PLAYGROUND_URL" >> .env && \
    echo "NEXT_PUBLIC_ASK_BUD_URL=$NEXT_PUBLIC_ASK_BUD_URL" >> .env && \
    echo "NEXT_PUBLIC_ASK_BUD_MODEL=$NEXT_PUBLIC_ASK_BUD_MODEL" >> .env

# Build the Next.js app
RUN yarn build

# Stage 3: Run the application
FROM node:lts-alpine AS runner

WORKDIR /usr/bin/src

# Set production environment
ENV NODE_ENV=production

# Copy only necessary files for running the app
COPY --from=builder /usr/bin/src/public ./public
COPY --from=builder /usr/bin/src/.next ./.next
COPY --from=builder /usr/bin/src/node_modules ./node_modules
COPY --from=builder /usr/bin/src/package.json ./package.json

# Copy the entrypoint script
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
RUN apk add curl
RUN apk add jq
ENTRYPOINT ["entrypoint.sh"]

# Default command (you can customize this if needed)
CMD ["node_modules/.bin/next", "start"]
#ENTRYPOINT ["sleep", "1000"]
