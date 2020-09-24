// /*global __dirname*/
const dbConnection = require('./data-base/db-connect');
// const urlParser = require('url')
const defaultHandler = require('./Request-handlers/default-handler');
const fs = require('fs')
const path = require('path');
// const User = require('./models/user-model');

// const getRequestRouter = require('./Request-handlers/get-request-handlers')
// const postRequestRouter = require('./Request-handlers/post-request-handlers')

// server creating
const http = require('http');
// const postName = '192.168.0.107'; // Home IP
const postName = '192.168.1.193' // Yojji IP
const port = 4001;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.end('Hello, who are you? You send plain gat request')
  
  switch (req.url) {
    case '/' : {
      const rootHtmlPath = path.join(__dirname, '../frontend/Home-page/index.html');
      const fileHtml = new fs.ReadStream(rootHtmlPath)
      res.setHeader('Content-Type', 'text/html')
      sendFile(fileHtml, res);
      break;
    }
    case '/index.css' : {
      const rootCssPath = path.join(__dirname, '../frontend/Home-page/index.css');
      const fileCSS = new fs.ReadStream(rootCssPath)
      res.setHeader('Content-Type', 'text/css')
      sendFile(fileCSS, res);
      break;
    }
    case '/index.js' : {
      const rootJSPath = path.join(__dirname, '../frontend/Home-page/index.js');
      const fileJS = new fs.ReadStream(rootJSPath)
      res.setHeader('Content-Type', 'application/javascript')
      sendFile(fileJS, res);
      break;
    }
    case '/todo' : {
      const todoHtmlPath = path.join(__dirname, '../frontend/Todo-page/index.html');
      const fileHtml = new fs.ReadStream(todoHtmlPath)
      res.setHeader('Content-Type', 'text/html')
      sendFile(fileHtml, res);
      break;
    }
    // case '/index.css' : {
    //   const todoCssPath = path.join(__dirname, '../frontend/Todo-page/index.css');
    //   const fileCSS = new fs.ReadStream(todoCssPath)
    //   res.setHeader('Content-Type', 'text/css')
    //   sendFile(fileCSS, res);
    //   break;
    // }
    // case '/index.js' : {
    //   const todoJSPath = path.join(__dirname, '../frontend/Todo-page/index.js');
    //   const fileJS = new fs.ReadStream(todoJSPath)
    //   res.setHeader('Content-Type', 'application/javascript')
    //   sendFile(fileJS, res);
    //   break;
    // }
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
  const { method } = req;
  switch (method) {
    // case 'GET': {
    //   getRequestRouter(req, res, dataBase);
    //   break;
    // }
    // case 'POST': {
    //   postRequestRouter(req, res, dataBase);
    //   break;
    // }
    default: {
      defaultHandler(req, res);
    }
  }
})

server.listen(port, postName, () => {
  console.log(`server running at http://${postName}:${port}`)
  dbConnection.connect();
})

module.exports = postName;