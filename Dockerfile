# Use Node.js LTS
FROM node:18-alpine
# Install python
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]