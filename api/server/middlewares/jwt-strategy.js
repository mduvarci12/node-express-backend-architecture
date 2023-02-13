import database from '../src/models';
import passportJWT from 'passport-jwt'
import passport from 'passport'

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })

export const ensureAuthenticationToken = (req, res, next) => {
    if (!req.isAuthenticated()) return next({error: 'error'})
  next()
}

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false })
  next()
}

export default new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET,
  },
  async function (jwtPayload, cb) {
    try {
      const user = await database.User.findById(jwtPayload._id)
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }
)
