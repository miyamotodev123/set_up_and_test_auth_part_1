// app/routes.js

module.exports = function (app, passport) {

    // LOGOUT ==============================
    app.post('/logout', function(req, res) {
        req.logout();
        res.status(200).json({ redirect: '/logout' });
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form

    app.post('/signup', function(req, res, next) {
        // if email or password is missing, return an error message
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email and Password required.'});
        }

        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return res.status(400).json(err);
            }
            if (user.error) {
                return res.status(400).json({ error: user.error });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json({ redirect: '/profile' });
            });
        })(req, res);
    });

    // =====================================
    // LOGIN ==============================
    // =====================================
    // process the login form
    app.post('/login', function (req, res, next) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({error: 'Email and Password required.'});
        }

        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return res.status(400).json({error: err});
            }
            if (user.error) {
                return res.status(400).json({error: user.error});
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json({redirect: '/profile'});
            });
        })(req, res);
    });

    app.get('/api/userData', isLoggedInAjax, function(req, res) {
        return res.json(req.user);
    });

    // route middleware to ensure user is logged in - ajax get
    function isLoggedInAjax(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.status(400).json( { redirect: '/login' } );
        } else {
            next();
        }
    }
}