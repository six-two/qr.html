import { createServer } from 'http';
import { readFile } from 'fs';
import { join } from 'path';

const PORT = 8080;

const server = createServer((req, res) => {
  const filePath = join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});