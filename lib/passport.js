module.exports = function (app) {
    var authData = require('../lib/authData');

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
        // 로그인에 성공한 것을 session store에 저장하는 역할
        // console.log('serializeUser', user);
        done(null, user.email); //사용자 식별자
    });

    passport.deserializeUser(function (id, done) {
        //브라우저 refresh할때마다 호출됨
        // console.log('deserializeUser', id);
        done(null, authData);
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'pwd',
            },
            function (username, password, done) {
                // console.log('LocalStrategy', username, password);
                if (username === authData.email) {
                    if (password === authData.password) {
                        return done(null, authData, { message: 'Welcome' });
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                } else {
                    return done(null, false, { message: 'Incorrect username.' });
                }
            }
        )
    );
    return passport;
};
