# XRPCode

A web code editor for the XRP using Blockly and micropython

## Features

* Code editor with Python syntax highlighting
* Shell for interacting with the XRP MicroPython REPL
* Output from running programs shown in shell
* Filesystem panel for observing and modifying files on the XRP's flash filesystem
* File upload and REPL interaction through webSerial
* All work immediately saved to page in case of accidental page refresh or browser exit
* Import and export files to and from the web IDE and PC
* Easy connect and disconnect of XRP
    * Automatically connects XRP if it has connected to the page before

**Note:** Only Google Chrome and Microsoft Edge are officially supported by the WebSerial JavaScript API

## Development Container

This project includes a development container that provides all the necessary dependencies to run and develop the XRPCode project.

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Getting Started

1. Open this project in Visual Studio Code
2. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command from the command palette
3. VS Code will build the container and set up the development environment

### Running the Application

Once inside the development container, you can run the application using the development server:

```bash
# Run with HTTP on port 8080 (default)
python dev_server.py

# Run with HTTPS on port 443
python dev_server.py --https

# Run with HTTP on custom port
python dev_server.py --port 3000

# Run with HTTPS on custom port
python dev_server.py --https --port 8443
```

#### Legacy Methods

You can also use the original methods if needed:

```bash
# HTTP Server (Port 8080)
python -m http.server 8080

# HTTPS Server (Port 443)
python server.py
```

### Accessing the Application

- Default HTTP Server: http://localhost:8080
- Default HTTPS Server: https://localhost:443

### Notes

- The container forwards ports 8080 and 443 to your local machine
- Chrome or Edge browser is required for WebSerial API support
- The container includes a self-signed certificate for HTTPS support
