import http from 'http';

const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Context-Type': 'text/html' });
  res.end('<h1> Hello World</h1>');
});

server.listen(port, host, () => {
  console.log('server running on http://localhost:3000');
});
