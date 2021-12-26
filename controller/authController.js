// all signup, login, forgot
let userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../secrets')
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
module.exports.isAuthorisedFor = function isAuthorizedFor(roles) {
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        }
        else {
            res.status(401).json({ message: "You are not authorized for this request" }) //UnAuthorised 
        }
    }
}



//🔑logged in or not
// if logged out->🛑not granted to enter
// if logged in->🙏u are welcome
//So we'll use Cookies🍪
// when loggedin successfully -> payload -> id -> {role, display profile}
module.exports.protectRoute = async function protectRoute(req, res, next) { //promise in the middleware
    try {
        let token = req.cookies.isLoggedIn
        if (token) {
            let payload = jwt.verify(token, JWT_SECRET_KEY); // unique id of DB's dom
            if (payload) { //wrapper on id
                let user = await userModel.findById(payload.payload)
                if (user) {
                    // console.log(req);
                    req.role = user.role //req वाले object में हमने role -property डाल दी है
                    req.id = user.id // ऐसे ही id -property
                    // console.log(req);
                    next();
                }
            }
        }
        else { //there is no cookie stored named as 'isLoggedIn'
            return res.json({
                message: "Please Login first"
            })
        }
    } catch (err) {
        return res.json({ message: err.message })
    }

}

