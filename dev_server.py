#!/usr/bin/env python3
"""
XRPCode Development Server
Run with: python dev_server.py [--https] [--port PORT]

Options:
  --https    Run server with HTTPS (default: HTTP)
  --port     Specify port number (default: 8080 for HTTP, 443 for HTTPS)
"""

import argparse
import http.server
import ssl
import os
import sys

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support"""
    
    def send_response(self, *args, **kwargs):
        http.server.SimpleHTTPRequestHandler.send_response(self, *args, **kwargs)
        self.send_header('Access-Control-Allow-Origin', '*')

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        return super(CORSRequestHandler, self).end_headers()

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='XRPCode Development Server')
    parser.add_argument('--https', action='store_true', help='Run server with HTTPS')
    parser.add_argument('--port', type=int, help='Port number (default: 8080 for HTTP, 443 for HTTPS)')
    args = parser.parse_args()
    
    # Set default port based on protocol
    if args.port is None:
        args.port = 443 if args.https else 8080
    
    # Create server
    server_address = ('127.0.0.1', args.port)
    httpd = http.server.HTTPServer(server_address, CORSRequestHandler)
    
    # Configure SSL if HTTPS is requested
    if args.https:
        cert_path = './dummy.pem'
        if not os.path.exists(cert_path):
            print(f"Error: Certificate file '{cert_path}' not found.")
            print("You can create one with: openssl req -new -x509 -keyout dummy.pem -out dummy.pem -days 365 -nodes")
            sys.exit(1)
        httpd.socket = ssl.wrap_socket(httpd.socket, certfile=cert_path, server_side=True)
        protocol = "HTTPS"
    else:
        protocol = "HTTP"
    
    # Start server
    print(f"Starting {protocol} server on http{'s' if args.https else ''}://127.0.0.1:{args.port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    main()
