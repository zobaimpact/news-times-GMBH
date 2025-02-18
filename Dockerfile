FROM node:20-alpine

# Set working directory
WORKDIR /src

# Copy package.json and lock file
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the Vite development port
EXPOSE 3000

# Build the application
RUN yarn build

# Start the application
CMD ["yarn", "serve"]

