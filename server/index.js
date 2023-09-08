const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const PUBLIC_DIRECTORY = path.join(__dirname, "../public");
const PORT = 8000;


const server = (req, res) => {

    if (req.url === "/") {
        req.url = "/index.html"
    } else if (req.url === '/cars') {
        req.url = '/cars.html'
    } else {
        req.url = req.url;
    }
    const parseURL = url.parse(req.url);
    const pathName = `${parseURL.pathname}`;
    const extension = path.parse(pathName).ext;
    const absolutePath = path.join(PUBLIC_DIRECTORY, pathName);

    const contentTypes = {
        ".css": "text/css",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".html": "text/html",
        ".js": "text/javascript",
    };

    fs.readFile(absolutePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end("File not found ...");
        } else {
            res.setHeader("Content-Type", contentTypes[extension] || "text/plain");
            res.end(data);
        }
    });
}

http.createServer(server).listen(PORT);
console.log(`Server is running ... PORT : localhost:${PORT}`);