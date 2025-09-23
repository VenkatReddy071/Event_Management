const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user/UserMode');
require('dotenv').config();

passport.serializeUser((user, done) => {

    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.SERVER_URL + '/auth/google/callback'
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const currentUser = await User.findOne({ googleId: profile.id });

                if (currentUser) {
                    currentUser.lastLogin = Date.now();
                    await currentUser.save();
                    console.log('User found:', currentUser.username);
                    done(null, currentUser);
                } else {

                    const newUser = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        lastLogin: Date.now(),
                        type: 'student',
                    });
                    await newUser.save();
                    console.log('New user created:', newUser.username);
                    done(null, newUser);
                }
            } catch (err) {
                console.error('Error during Google OAuth:', err);
                done(err, null);
            }
        }
    )
);
