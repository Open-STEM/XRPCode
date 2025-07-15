FROM python:3.9-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    openssl \
    ca-certificates \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome for WebSerial support (headless mode)
RUN curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Python dependencies will be installed from requirements.txt after container starts
# This avoids the COPY issue during build

# Install Node.js for http-server
RUN apt-get update && apt-get install -y nodejs npm \
    && npm install -g http-server \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /workspace

# Generate a self-signed certificate for HTTPS
RUN mkdir -p /workspace/certs \
    && openssl req -new -x509 -keyout /workspace/certs/dummy.pem -out /workspace/certs/dummy.pem -days 365 -nodes -subj "/CN=localhost"

# Switch to non-root user
USER $USERNAME

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose ports
EXPOSE 8080 443
