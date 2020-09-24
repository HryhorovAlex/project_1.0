const urlParser = require('url');
const defaultHandler = require('./default-handler');
const User = require('../models/user-model');

class CreateGetRequestHandlers {
  getUsers = async(req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { method, url } = req;
    const isUrl = url === '/users';
    const isGet = 'GET' === method;
    const users = await User.findAll()
    try {
      if (isGet && isUrl && users.length) {
        res.statusCode = 200;
        res.write(JSON.stringify(users))
        res.end()
      } else {
          res.statusCode = 200;
          res.write(JSON.stringify({answer: `There no users yet`}))
          res.end()
      }
    } catch (e) {
      res.statusCode = 500;
      console.log('[Get Users Error] : ', e)
      res.write(JSON.stringify({answer: `server error`}))
      res.end()
    }
  }

  getUserById = async (req, res, id) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const user = await User.findAll({
        where: {
          id: id
        }
      })
      if (user.length) {
        res.statusCode = 200;
        res.write(JSON.stringify(user))
        res.end()
      } else {
        res.statusCode = 200;
        res.write(JSON.stringify({answer: `There is no user with id [${id}]`}))
        res.end()
      }
    } catch (err) {
      res.statusCode = 500;
      res.write(JSON.stringify({error: `unexpected server error in getting user`}))
      res.end()
    }
  }
}

const getRequestRouter = (request, response) => {
  const getHandlers = new CreateGetRequestHandlers()
  const { url } = request;

  const parsedUrl = urlParser.parse(url, true)
  if (!Object.keys(parsedUrl.query).length) {
    switch (parsedUrl.pathname) {
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