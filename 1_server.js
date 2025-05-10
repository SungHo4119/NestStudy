import http from 'http';
import url from 'url';

const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  // req.url  = 요청이 들어온 url
  const path = url.parse(req.url).path;

  if (path === '/') {
    // http://localhost:3000 인 경우 '/' 와 같다
    res.writeHead(200, { 'Context-Type': 'text/html' });
    res.end('<h1> Home Page</h1>');
  } else if (path === '/post') {
    res.writeHead(200, { 'Context-Type': 'text/html' });
    res.end('<h1> Post Page</h1>');
  } else if (path === '/user') {
    res.writeHead(200, { 'Context-Type': 'text/html' });
    res.end('<h1> User Page</h1>');
  } else {
    res.writeHead(404, { 'Context-Type': 'text/html' });
    res.end('<h1> 404 Page Not Found</h1>');
  }
});

server.listen(port, host, () => {
  console.log('server running on http://localhost:3000');
});
