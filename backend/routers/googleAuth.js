const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../auth/JWT');
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${CLIENT_URL}/login`,
        session: false
    }),
    (req, res) => {

        if (req.user) {
            const token = generateToken(req.user);
            res.redirect(`${CLIENT_URL}/oauth-success?token=${token}`);
        } else {
            res.redirect(`${CLIENT_URL}/login`);
        }
    }
);

module.exports = router;
