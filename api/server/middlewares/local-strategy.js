import { Strategy as LocalStrategy } from 'passport-local'
import database from '../src/models';

import bcrypt from 'bcrypt'

export const ensureAuthentication = (req, res, next) => {
    if (!req.isAuthenticated()) return next({ error: 'error' })
    next()
}



export const ensureEmailVerified = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') return next()

    const isVerified = await Account.exists({
        email: req.body.email,
        emailVerified: true,
    })

    if (!isVerified)
        return next({ error: 'bad request' }
        )

    next()
}

export default new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const user = await database.User.scope('withPassword').findOne({ where: { email }, raw: true })
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            } else {
                if (await bcrypt.compare(password, user.password)) {
                    delete user.password;
                    return done(null, user)
                }
                return done(null, false, { message: 'Incorrect email or password.' });
            }
        } catch (err) {
            done(err)
        }
    }
)
