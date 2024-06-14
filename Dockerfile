FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory for development
FROM base AS install
WORKDIR /temp/dev
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Install only production dependencies into a separate temp directory
WORKDIR /temp/prod
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy node_modules and project files into the image for testing and building
FROM base AS prerelease
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .

# [Optional] Run tests and build
ENV NODE_ENV=production
RUN bun test

# Prepare final release image
FROM base AS release
WORKDIR /usr/src/app
COPY --from=prerelease /usr/src/app .
COPY --from=install /temp/prod/node_modules ./node_modules

# Run the app
USER bun
ENTRYPOINT ["bun", "run", "start"]
