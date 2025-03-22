const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Path to the SSL certificates in the root directory
const certPath = path.resolve(__dirname, '..', 'certs');
const options = {
  key: fs.readFileSync(path.join(certPath, '192.168.1.223-key.pem')),
  cert: fs.readFileSync(path.join(certPath, '192.168.1.223.pem')),
};

app.prepare().then(() => {
  createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on https://192.168.1.223:3001');
  });
});