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
            const data = {
                user1 : auxiliaryUser.userName,
                 id: auxiliaryUser._id
            };
                res.render('profile', data);
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

router.get('/profile', (req, res, next) => {
    res.render('profile');
});

router.get('/edit',(req, res, next) => {
    res.render('edit');
});

router.post('/edit', (req, res, next) => {
//    const userId = req.body.id;
   const userName = req.body.username;
   User.findByIdAndUpdate(userName, {
       userName: req.body.username,
       email: req.body.email
   })
   .then(()=>{
        res.render('login');
   });
});


module.exports = router;
