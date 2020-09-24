const urlParser = require('url');
const defaultHandler = require('./default-handler');
const User = require('../models/user-model');

class CreateDeleteRequestHandlers {
  deleteUser = async (req, res, id) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      await User.destroy({
        where: {
          id: id
        }
      })
      res.statusCode = 200;
      res.write(JSON.stringify({answer: `user with id ${id} has been deleted`, id: id}))
      res.end()
        // res.statusCode = 200;
        // res.write(JSON.stringify({answer: `There is no user with id [${id}]`}))
        // res.end()
    } catch (err) {
      res.statusCode = 500;
      res.write(JSON.stringify({error: `unexpected server error in getting user`}))
      res.end()
    }
  }
}

const deleteRequestRouter = (request, response) => {
  const putHandlers = new CreateDeleteRequestHandlers()
  const { url } = request;
  const parsedUrl = urlParser.parse(url, true)
  switch (parsedUrl.pathname) {
    case '/users' : {
      putHandlers.deleteUser(request, response, parsedUrl.query.id);
      break;
    }
    default : {
      defaultHandler(request, response);
    }
  }
}

module.exports = deleteRequestRouter;