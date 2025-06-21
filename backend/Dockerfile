FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally (optional but recommended)
RUN npm install -g nodemon

# Copy app source
COPY . .

# Expose backend port
EXPOSE 5000

# Run the app with nodemon
CMD ["nodemon", "app.js"]
