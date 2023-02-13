import { Router } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const { body, check, validationResult } = require('express-validator')
import database from '../src/models';
require('dotenv').config();

const router = Router();

router.post('/login', function (req, res, next) {
    try {

        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                console.log(err)
                return res.status(400).json({
                    status: "error",
                    message: err || info.message,
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(user, process.env.TOKEN_SECRET);
                return res.json({ status: "success", user, token });
            });
        })(req, res);
    } catch (e) {
        res.status(500).json({ message: "Error in invocation of API: /auth" })
    }
});


router.post('/register',
    body('email').isEmail(),
    body('name').isString().isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array());
            } else {
                const existingAccount = await database.User.findOne({
                    where: { email: req.body.email.toLowerCase(), }
                })

                if (existingAccount) {
                    return res.status(422).json({ error: 'email already registered' });
                }
                const newUser = await database.User.create({ ...req.body, password: await bcrypt.hash(req.body.password, 10) }, { raw: true })
                if (!newUser) { return res.status(500).json({ error: 'account not created' }); }
                await newUser.reload();
                const token = jwt.sign(newUser.toJSON(), process.env.TOKEN_SECRET);
                return res.json({ status: "success", user: newUser, token });
            }

        } catch (e) {
            res.status(500).json({ message: "Error in invocation of API: /auth" })
        }
    }

);

module.exports = router;