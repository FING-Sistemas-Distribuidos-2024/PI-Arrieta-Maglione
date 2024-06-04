FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json .

# Copy the application code
COPY . .

# Install Redis
RUN apk add --no-cache redis

# Build the Next.js application
RUN npm run build

# Expose the desired ports
EXPOSE 3000
EXPOSE 6379

# Start Redis server
CMD ["redis-server", "--daemonize", "yes"]

# Start the Next.js application
CMD ["yarn", "start"]