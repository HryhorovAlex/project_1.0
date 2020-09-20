const dataBase = require('./data-base');
const urlParser = require('url')
const defaultHandler = require('./Request-handlers/default-handler');
const fs = require('fs')
const path = require('path');

const getRequestRouter = require('./Request-handlers/get-request-handlers')

// server creating
const http = require('http');
const postName = '192.168.0.107';
const port = 4000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.end('Hello, who are you? You send plain gat request')
  const rootHtmlPath = path.join(__dirname, '../frontend/index.html');
  const rootCssPath = path.join(__dirname, '../frontend/index.css');
  switch (req.url) {
    case '/' : {
      const fileHtml = new fs.ReadStream(rootHtmlPath)
      res.setHeader('Content-Type', 'text/html')
      sendFile(fileHtml, res);
      break;
    }
    case '/index.css' : {
      const fileCSS = new fs.ReadStream(rootCssPath)
      res.setHeader('Content-Type', 'text/css')
      sendFile(fileCSS, res);
      // break;
    }
  }

  function sendFile(file, res) {
    file.pipe(res)

    file.on('error', (err) => {
      res.statusCode = 500;
      res.end('Server error');
      console.log('[Send File Error]: ', err)
    })
    res.on('close', () => {
      file.destroy()
    })
  }
})

// handle request
server.on('request', (req, res) => {
  const { method, url } = req;
  switch (method) {
    case 'GET': {
        getRequestRouter(req, res, dataBase);
        break;
    }
    // case '/POST': {
    //   requestHandler.getUsers(req, res);
    // }
    default: {
      defaultHandler(req, res);
    }
  }
})

server.listen(port, postName, () => {
  console.log(`server running at http://${postName}:${port}`)
})

