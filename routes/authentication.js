'use strict';

const {Router} = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');


router.get('/', (req, res, next) => {
    res.render('sign-up');
});

router.post('/', (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;

        bcrypt.hash(password, 10)
            .then(hash => {
                console.log('User created');
                return User.create({
                    userName,
                    passwordHash: hash
                });  
                
            //   User.create()
            //       .then(() => {
            //         const data = {
            //             userName,
            //             passwordHash: hash
            //         };
            //         res.redirect('private');
            //       });
            })
            .then(user => {
                req.session.user = {
                  _id: user._id
                };
                // res.render('private')
                res.redirect('login');
            })
            // res.redirect('private')
            .catch(error => {
                console.log('There was an error in the sign up process.', error);
              });
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    let auxiliaryUser;

    User.findOne({userName})
        .then(user => {
            if (!user) {
                // throw new Error('User does not exist');
                // res.send('User does not exist');
                res.redirect('main');
            } else {
                auxiliaryUser = user;
                return bcrypt.compare(password, user.passwordHash);
            }
        })
        .then(matches => {
            if (!matches) {
                // throw new Error('Password does not match');
                res.redirect('main');
            } else {
                req.session.user = {
                    _id: auxiliaryUser._id
                };
                res.redirect('private');
            }
        })
        .catch(error => {
            console.log('There was an error signing in the user', error);
            next(error);
          });
});

router.get('/private', (req, res, next) => {
    res.render('private');
});

router.get('/main', (req, res, next) => {
    res.render('main');
});
module.exports = router;
