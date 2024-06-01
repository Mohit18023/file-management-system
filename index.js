// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const filePath = path.join(__dirname, "files", url);

  if (method === "POST" && url === "/create") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { filename, content } = JSON.parse(body);
      const file = path.join(__dirname, "files", filename);
      fs.writeFile(file, content, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          res.writeHead(201, { "Content-Type": "text/plain" });
          res.end("File created successfully");
        }
      });
    });
  } else if (method === "GET" && url.startsWith("/read/")) {
    const filename = url.replace("/read/", "");
    const file = path.join(__dirname, "files", filename);
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(data);
      }
    });
  } else if (method === "DELETE" && url.startsWith("/delete/")) {
    const filename = url.replace("/delete/", "");
    const file = path.join(__dirname, "files", filename);
    fs.unlink(file, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("File deleted successfully");
      }
    });
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method not allowed");
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
