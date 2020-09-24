const urlParser = require('url');
const defaultHandler = require('./default-handler');
const User = require('../models/user-model');

class CreatePutRequestHandlers {
  updateUser = async (req, res, id) => {
    res.setHeader('Content-Type', 'application/json');
    let body = '';
    try {
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json');
        const parsedData = JSON.parse(body);
        await User.update({...parsedData}, {
          where: {
            id: id
          }
        });
        res.write(body)
        req.pipe(res)
      });
    } catch (err) {
        res.statusCode = 500;
        console.log('[Put Users Error] : ', err)
        res.write(JSON.stringify({answer: `server error`}))
        res.end()
    }
  }
}

const putRequestRouter = (request, response) => {
  const putHandlers = new CreatePutRequestHandlers()
  const { url } = request;
  const parsedUrl = urlParser.parse(url, true)

  if(parsedUrl.query && parsedUrl.query.id) {
    switch (parsedUrl.pathname) {
      case '/users' : {
        putHandlers.updateUser(request, response, parsedUrl.query.id);
        break;
      }
      default : {
        defaultHandler(request, response);
      }
    }
  } else {
    defaultHandler(request, response);
  }
}

module.exports = putRequestRouter;