# Use Node.js 18 (or your preferred version)
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your app runs on (Hugging Face routes traffic to port 7860 by default)
EXPOSE 7860

# Start the application
CMD [ "node", "server.js" ]
