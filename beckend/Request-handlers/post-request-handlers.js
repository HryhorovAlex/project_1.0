const urlParser = require('url');
const defaultHandler = require('./default-handler');

const User = require('../models/user-model');

// function generateId() {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }


class CreatePostRequestHandlers {
  postNewUser = async (req, res) => {
    let body = '';
    try {
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        const parsedData = JSON.parse(body);
        User.create({...parsedData})
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

const postRequestRouter = (request, response) => {
  const postHandlers = new CreatePostRequestHandlers()
  const { url } = request;
  const parsedUrl = urlParser.parse(url, true)
    switch (parsedUrl.pathname) {
      case '/users' : {
        postHandlers.postNewUser(request, response);
        break;
      }
      default : {
        defaultHandler(request, response);
      }
    }
}

module.exports = postRequestRouter;