# Stage 1: Builder
# Use a stable Node.js version as the base image for building the application.
# Using a specific version (e.g., 20) is better than 'latest' for reproducibility.
# For a smaller final image, you might consider using a '-alpine' variant
# in a multi-stage build for the final runtime stage.
FROM node:20 AS builder

# Set the working directory inside the container.
# All subsequent instructions will be executed in this directory (/app).
WORKDIR /app

# Copy package.json and the lock file (package-lock.json or yarn.lock) first.
# Copying these files alone allows Docker to cache the dependency installation step.
# This step will only be re-run if package.json or the lock file changes,
# significantly speeding up subsequent builds if only source code changes.
COPY package*.json ./
# If you are using yarn, use these lines instead:
# COPY yarn.lock ./

# Install dependencies.
# 'npm ci' is recommended in automated environments (like Docker builds or CI/CD)
# because it performs a clean install based strictly on the lock file,
# ensuring that you get the exact same dependency versions every time.
RUN npm ci
# If you are using yarn:
# RUN yarn install --frozen-lockfile

# Copy the rest of the application source code into the working directory (/app).
# Ensure you have a .dockerignore file in your project root to exclude unnecessary files/directories
# (like node_modules, dist, git files, editor config files, etc.) to keep the image size down
# and speed up the build process.
COPY . .

# Build the NestJS application.
# This command compiles the TypeScript code into JavaScript, typically into the 'dist' folder.
# The specific command depends on the 'build' script defined in your package.json.
RUN npm run build
# If you are using yarn:
# RUN yarn build

# --- Runtime Configuration ---
# In this single-stage Dockerfile, the runtime environment is the same as the builder stage.
# For production, a common practice is to use a multi-stage build where
# you copy only the necessary build outputs (like the 'dist' folder and production dependencies)
# into a smaller, minimal base image (e.g., node:20-alpine or a 'distroless' image)
# to reduce the final image size and attack surface.

# Expose the port that the application listens on.
# This is primarily documentation for users of the image, indicating which port
# should be published when running the container. The actual port mapping is done
# when you run the container (e.g., `docker run -p 3000:3000`) or in `docker-compose.yml`.
EXPOSE 3000

# Define the default command to run the application when the container starts.
# This command should execute the compiled JavaScript entry file, which is typically
# `dist/main.js` for a NestJS application after running `npm run build`.
# Ensure this command matches the script you would use to start your built application.
CMD [ "node", "dist/main" ]

# Note on using with docker-compose development volumes:
# When using this Dockerfile in conjunction with the `docker-compose.yml` provided earlier
# for a development setup (which likely mounts your local source code into the container
# using volumes like `- ./src:/app/src`), the `COPY . .` instruction's effect on source files
# will be overwritten by the volume mount.
# The `RUN npm run build` step also occurs during the initial image build.
# For live reloading during development with volumes, you would typically override the `CMD`
# in your `docker-compose.yml` to run a command that watches your mounted source code
# (e.g., `npm run start:dev`, assuming your `start:dev` script uses nodemon or similar).
# The `Dockerfile` above is primarily structured for creating a build artifact (the image)
# that contains the ready-to-run compiled application, suitable for production deployment,
# although it serves as the base for the development container setup via compose overrides.