import os
import sys
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

directory = sys.argv[1]

os.chdir(directory)

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

PORT = 8000

with TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Received KeyboardInterrupt - Shutting Down")
    finally:
        httpd.server_close()