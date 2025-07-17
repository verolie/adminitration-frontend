# Use Node official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# ✅ Set production mode
ENV NODE_ENV=production

# Copy package files first
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy source
COPY . .

# Build Next.js for production
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
