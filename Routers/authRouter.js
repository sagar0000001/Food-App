let express = require('express');
let path = require('path');
let authRouter = express.Router();
let userModel = require('../models/userModel');

authRouter
    .route('/signup')
    .get(getSignUp)
    .post(postSignUp)

async function postSignUp(req, res) {
    let data = req.body;
    let user = await userModel.create(data); // 📌insert into our DB collection

    res.json({
        message: "you are signed up",
        YourDataInOurDb: user
    });
}

function getSignUp(req, res) {
    res.sendFile('signup.html', { root: './public' }) // For mongoDB (🤔like that only)
    // res.sendFile('../public/signup.html', { root: __dirname })
}

module.exports = authRouter;