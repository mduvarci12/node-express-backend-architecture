import { Router } from 'express';
import jwt from 'jsonwebtoken'
import verifyToken from '../middlewares/parse-token'
require('dotenv').config();
import { getProfileById } from '../services/user-service'

const router = Router();

router.get('/profile', verifyToken, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_SECRET, (err, authData) => {
            if (err)
                res.sendStatus(403);
            else {
                res.json({ user: authData })
            }
        })
    } catch (e) {
        res.status(500).json({ message: "Error in invocation of API: /profile" })
    }
});

router.get('/profile/:id', async (req, res) => {
    try {
        const user = await getProfileById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "Profile Not Found" })
        }
        return res.json(user)
    } catch (e) {
        res.status(500).json({ message: "Error in invocation of API: /profile" })
    }
});



module.exports = router;