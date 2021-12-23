let express = require('express');
let authRouter = express.Router();
let userModel = require('../models/userModel');
let bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let JWT_KEY = "sdjr8ere09u" //random (our choice)

authRouter
    .route('/signup')
    .get(getSignUp)
    .post(postSignUp)

authRouter
    .route('/login')
    .post(loginUser)


async function loginUser(req, res) { // from email, password
    try { // validating data from frontend
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email }); // from database🏪
            console.log(user);

            if (user) {
                // let salt = await bcrypt.genSalt(); // giving promise
                // let hashedString = await bcrypt.hash(data.password, salt);
                if (user.password == data.password) {
                    let uid = user['_id']; //unique id🆔 ,inside mongoDB🏪
                    let jwt_token = jwt.sign({ payload: uid }, JWT_KEY); //creating signature🔑
                    // res.cookie("isLoggedIn", true)
                    res.cookie("isLoggedIn", jwt_token)
                    res.send("you are logged in")

                    /* Our jwt token is loking like this
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
                    eyJwYXlsb2FkIjoiNjFiZDJiOGY1YTJiOWUwZDQ3OGZhZWVlIiwiaWF0IjoxNjQwMjQ4MTI0fQ.
                    Gjz4voOS9-V5AiYQgDosGqCV-mm15TeTLGgy5xG32X8 
                    
                    This is our Signature made up of
                    1) Header (encryption algorithm) ->here the default encryptn = H256 
                    2) Payload (unique id) ->from our database
                    3) Secret key ->which is random -> a string of our choice
                    
                    */
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