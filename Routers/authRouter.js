let express = require('express');
let authRouter = express.Router();
let userModel = require('../models/userModel');
let bcrypt = require('bcrypt')

authRouter
    .route('/signup')
    .get(getSignUp)
    .post(postSignUp)

authRouter
    .route('/login')
    .post(loginUser)


async function loginUser(req, res) {
    try { // validating data from frontend
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email });
            console.log(user);

            if (user) {
                // let salt = await bcrypt.genSalt(); // giving promise
                // let hashedString = await bcrypt.hash(data.password, salt);
                if (user.password == data.password) {
                    res.send("you are logged in")
                }
                else res.send("password incorrect")
            }
            else { // user := null
                res.send("user not found");
            }
        }
        else {
            res.json({
                message: "empty fields found" //email not entered
            })
        }

    } catch (err) {
        res.json({
            err: err.message
        })
    }

}

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