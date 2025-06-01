# Use a Node.js runtime as the base image
FROM node:22-alpine

# Install the specific version of npm
RUN npm install -g npm@11.3.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
# COPY . .

# Build the application (if necessary - adjust command as needed)
# RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]