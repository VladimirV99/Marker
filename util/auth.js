const passport = require('passport');

module.exports.getUser = function(req, res, next) {
  if(req.headers.authorization) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
      if(err) {
        return res.status(500).json({success: false, message: 'Something went wrong'});
      }
      if(user){
        req.user = user;
        req.user.authenticated = true;
      } else {
        req.user = { id: 0, authenticated: false };
      }
      next();
    })(req, res, next);
  } else {
    req.user = { id: 0, authenticated: false };
    next();
  }
}