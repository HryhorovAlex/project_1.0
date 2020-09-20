const urlParser = require('url');
const defaultHandler = require('./default-handler');
const fs = require('fs')
const path = require('path');

class CreateGetRequestHandlers {

  constructor(dataBase) {
    this.db = dataBase;
  }

  get = (req, res) => {
    res.statusCode = 200;
    // res.end('Hello, who are you? You send plain gat request')
    const rootHtmlPath = path.join(__dirname, '../../frontend/index.html');
    const rootCssPath = path.join(__dirname, '../../frontend/index.css');
    
    console.log(req.url, '=======')
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
  }

  getUsers = (req, res) => {
    const { method, url } = req;
    // Checks
    const isUrl = url === '/users';
    const isGet = 'GET' === method;
    const isPresentInDb = this.db.has('users')
    try {
      if (isGet && isUrl && isPresentInDb) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify({
          users :Object.values(this.db.get('users'))
        }))
        res.end()
      }
    } catch (e) {
      res.statusCode = 404;
      res.write('some error')
      res.end()
    }
  }

  getUserById = (req, res, id) => {
    const isUserPresent = this.db.get('users').find(user => user.id == id);
    res.setHeader('Content-Type', 'application/json');
    if (isUserPresent) {
      res.statusCode = 200;
      res.write(JSON.stringify(isUserPresent))
      res.end()
    } else {
      res.statusCode = 200;
      res.write(JSON.stringify({error: `There is no user with id: ${id}`}))
      res.end()
    }
  }
}

const getRequestRouter = (request, response, database) => {
  const getHandlers = new CreateGetRequestHandlers(database)
  const { url } = request;

  const parsedUrl = urlParser.parse(url, true)
  if (!Object.keys(parsedUrl.query).length) {
    switch (parsedUrl.pathname) {
      // case '/' : {
      //   getHandlers.get(request, response);
      //   break;
      // }
      case '/users' : {
        getHandlers.getUsers(request, response);
        break;
      }
    }
    return
  } else if (parsedUrl.query) {
      if (parsedUrl.pathname === '/users' && parsedUrl.query.id) {
        getHandlers.getUserById(request, response, parsedUrl.query.id)
        return
      }
  } else {
    defaultHandler(request, response);
  }

}

module.exports = getRequestRouter;