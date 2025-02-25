require('dotenv').config();
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('../models/User');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.authToken, // Extraer token desde la cookie
  ]),
  secretOrKey: process.env.JWT_SECRET, // Usar variable de entorno
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