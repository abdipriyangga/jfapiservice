const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;
const { response } = require('./response');

const token = (req, res, next) => {
  console.log("HEADERS: ", req.headers);
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.slice(7);
        const user = jwt.verify(token, APP_SECRET_KEY);
        req.authUser = user;
        if (req.authUser.role === 'jamaah') {
          next();
        }
        else if (req.authUser.role === 'tour leader') {
          next();
        }
        else if (req.authUser.role === 'muttawif') {
          next();
        }
        else if (req.authUser.role === 'superAdmin') {
          next();
        }
        else {
          return response(res, 400, 'Sorry you dont have authorization!');
        }
      } catch (err) {
        return response(res, 401, 'Session expired, please login!');
      }
    }
  } else {
    return response(res, 401, 'Auth Token needed!');
  }
};

module.exports = token;