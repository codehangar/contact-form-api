var SessionService = require('../services/session.service.js');
var ErrorHandlerService = require('../services/error-handler.service.js');
var UserRepository = require('../repositories/user.repository.js');
var co = require('co');

/**
 * Authenticated Middleware
 * @param {Object} Express Request Object
 * @param {Object} Express Response Object
 */
var AuthenticatedMiddleware = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var errors;

  if (token) {
    // Get token value (user)
    // If exists check expiry, else throw invalid token
    co(function*() {
      var user = yield SessionService.getSession(token);
      if (user) {
        // Check expiryDate
        if (SessionService.expiryDateIsValid(user.sessionExpiryDate)) {
          // This takes care of making sure the user in the session is up to date on specific routes
          // We should make this better, perhaps target specific routes better
          // Or find an overall solution to making sure the user in the session does not go stale
          if (req.path.indexOf('user') !== -1) {
            user = yield UserRepository.getByEmail(user.email);
          }
          // If expiryDate is good lets renew it and continue
          yield SessionService.updateSession(token, user);
          // Add user and token to req object
          req.token = token;
          req.user = user;
          next();
        } else {
          // Token is expired, lets send error
          errors = {};
          return ErrorHandlerService.handleCustomErrors(400, errors, ErrorHandlerService.expiredToken, res);
        }
      } else {
        // No session was found, because of invalid token
        errors = {};
        return ErrorHandlerService.handleCustomErrors(400, errors, ErrorHandlerService.invalidToken, res);
      }
    }).catch(function(e) {
      return ErrorHandlerService.handleError(e, ErrorHandlerService.unknown, res);
    });
  } else {
    // if there is no token return error
    return ErrorHandlerService.handleCustomErrors(400, errors, ErrorHandlerService.noToken, res);
  }
};

module.exports = AuthenticatedMiddleware;
