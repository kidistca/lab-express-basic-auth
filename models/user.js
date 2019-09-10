'use strict';

// User model goes here
const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: true,
        unique: true
    }, 
    passwordHash: {
        type: String,
        required: true
    }, 
    email: {
        type: String
    }
});

// const autentication = 
module.exports = mongoose.model('User', authenticationSchema);