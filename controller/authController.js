// all signup, login, forgot
let userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
let JWT_SECRET_KEY = "sdjr8ere09u" //random (our choice)
let bcrypt = require('bcrypt');


module.exports.signup = async function postSignUp(req, res) {
    try {
        let data = req.body;
        let user = await userModel.findOne({ email: data.email })
        if (user) { //user exists in our DB
            return res.json({ message: "You are already signed up. You can signin" })
        }
        user = await userModel.create(data); // go for📌insert into our DB collection

        if (user) { //user successfully inserted into DB (pre Hook check cleared)🎉

            res.json({
                message: "you are signed up successfully🎉",
                YourDataInOurDb: user
            });
        } else res.send("Email not exist in our database/ password do not matches");

    } catch (err) { message: err.message };
}


module.exports.login = async function loginUser(req, res) { // from email, password
    try { // validating data from frontend
        let data = req.body;
        if (data.email && data.password) { // user have filled both email & password field
            let user = await userModel.findOne({ email: data.email }); // from database🏪

            if (user) { //email exist in our DB
                let isPasswordCorrect = bcrypt.compare(data.password, user.password); // user.password DB's Hashed password वाला है
                if (isPasswordCorrect) {
                    let uid = user['_id']; //unique id🆔 ,inside mongoDB🏪
                    let jwt_token = jwt.sign({ payload: uid }, JWT_SECRET_KEY); //creating signature🔑
                    res.cookie("isLoggedIn", jwt_token)
                    res.send("you are logged in")
                }
                else {
                    res.send("wrong credentials") //🚨(security)Don't ->password incorrect
                }
            }
            else { // user := null i.e. Not found in our DB
                res.send("user not found");
            }
        }
        else {
            res.json({
                message: "Input fields Empty"
            })
        }

    } catch (err) {
        res.json({
            err: err.message
        })
    }

}

// To Check User Role 
module.exports.isAuthorised = function isAuthorized(roles) {
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        }
        else {
            res.status(401).json({ message: "operation not allowed" }) //UnAuthorised 
        }
    }
}



//🔑logged in or not
// if logged out->🛑not granted to enter
// if logged in->🙏u are welcome
//So we'll use Cookies🍪
// when loggedin successfully -> payload -> id -> {role, display profile}
module.exports.protectRoute = function protectRoute(req, res, next) {
    try {
        let token;
        if (req.cookies.isLoggedIn) {
            token = req.cookies.isLoggedIn
            let payload = jwt.verify(req.cookies.isLoggedIn, JWT_SECRET_KEY); // unique id of DB's dom
            if (payload) { //wrapper on id
                let user = userModel.findById(payload.payload)
                req.role = user.role
                req.id = user.id
                next();
            }
            else {
                res.json({
                    message: "user is not verified"
                })
            }
        }
        else { //there is no cookie stored named as 'isLoggedIn'
            res.json({
                message: "Please Login first"
            })
        }
    } catch (err) { message: err.message }

}

