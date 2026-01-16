# Use an official Node runtime as a parent image
FROM node:18-slim

# Install Python 3 and pip
# We need python3-venv or similar usually, but standard python3 works on slim
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy python requirements first to cache them
COPY requirements.txt ./

# Create a virtual environment for python to avoid system conflicts
# and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define environment variables (Can be overridden at runtime)
# NODE_ENV should be production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
