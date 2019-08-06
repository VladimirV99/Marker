const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const credentials = require('./credentials');

const { User } = require('./database');

module.exports = (passport) => {
  let jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = credentials.passport_secret;
  passport.use('jwt', new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    User.findOne({ where: { id: jwt_payload.user_id } }).then(user => {
      if(!user) {
        return next(null, false);
      } else {
        user.authenticated = true;
        return next(null, user);
      }
    });
  }));
}