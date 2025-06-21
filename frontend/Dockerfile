FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the development server port
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
