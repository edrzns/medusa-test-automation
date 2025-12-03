# Use Node 20 Alpine as base
FROM node:20-alpine

# Install required system dependencies
RUN apk add --no-cache \
    git \
    wget \
    python3 \
    make \
    g++ \
    postgresql-client \
    redis

# Set working directory
WORKDIR /server

# Clone Medusa starter repository
RUN git clone https://github.com/medusajs/medusa-starter-default.git .

# Install dependencies
RUN npm install

# Copy custom configuration to disable SSL
COPY medusa-config.ts /server/medusa-config.ts

# Copy startup script
COPY start.sh /server/start.sh
RUN chmod +x /server/start.sh

# Expose Medusa port
EXPOSE 9000

# Start the application
CMD ["/server/start.sh"]