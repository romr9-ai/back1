const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('../models/User');

const SECRET_KEY = 'supersecretkey123'; // Cambia esto por una variable de entorno

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.authToken, // Extraer token desde cookie
  ]),
  secretOrKey: SECRET_KEY,
};

passport.use(
  new Strategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
