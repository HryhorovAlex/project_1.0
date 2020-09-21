const urlParser = require('url');
const defaultHandler = require('./default-handler');
const fs = require('fs')
const path = require('path');
const { parse } = require('querystring');

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


class CreatePostRequestHandlers {

  constructor(dataBase) {
    this.db = dataBase;
  }

  postNewUser = (req, res) => {
    let body = '';
    try {
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        console.log(typeof body);
        res.setHeader('Content-Type', 'application/json');
        const parsedData = JSON.parse(body);
        this.db.set('users', [
          ...this.db.get('users'),
          {...parsedData, id: generateId()}
        ])
        console.log('dataBase', this.db)
        res.write(body)
        req.pipe(res)
      });
    } catch (error) {
      console.log('[POST USER ERROR] : ', error)
      res.statusCode = 404;
      res.write('some error')
      res.end()
    }
  }
}

const postRequestRouter = (request, response, database) => {
  const postHandlers = new CreatePostRequestHandlers(database)
  const { url } = request;
  const parsedUrl = urlParser.parse(url, true)
    switch (parsedUrl.pathname) {
      case '/users-add' : {
        postHandlers.postNewUser(request, response);
        break;
      }
      default : {
        defaultHandler(request, response);
      }
    }
}

module.exports = postRequestRouter;