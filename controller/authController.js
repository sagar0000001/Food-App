// all signup, login, forgot
let userModel = require('../models/userModel')

module.exports.signup = async function postSignUp(req, res) {
    try {
        let data = req.body;
        let user = await userModel.create(data); // go for📌insert into our DB collection

        if (user) { //user successfully inserted into DB (pre Hook check cleared)🎉
            res.json({
                message: "you are signed up",
                YourDataInOurDb: user
            });
        } else res.send("Email not valid/ password do not matches");

    } catch (err) { message: err.message };
}


module.exports.login = async function loginUser(req, res) { // from email, password
    try { // validating data from frontend
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email }); // from database🏪

            if (user) {
                if (user.password == data.password) { //🚨Hashing not checked
                    let uid = user['_id']; //unique id🆔 ,inside mongoDB🏪
                    let jwt_token = jwt.sign({ payload: uid }, JWT_KEY); //creating signature🔑
                    res.cookie("isLoggedIn", jwt_token)
                    res.send("you are logged in")
                }
                else res.send("wrong credentials") //🚨(security)Don't ->password incorrect
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

// when loggedin successfully -> payload -> id -> {role, display profile}
module.exports.protectRoute = function protectRoute(req, res, next) {
    try {
        let token;
        if (req.cookies.isLoggedIn) {
            token = req.cookies.isLoggedIn
            let payload = jwt.verify(req.cookies.isLoggedIn, JWT_KEY); // unique id of DB's dom
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
                message: "operation not allowed"
            })
        }
    } catch (err) { message: err.message }

}

