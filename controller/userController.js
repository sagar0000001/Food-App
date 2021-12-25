// All the Logic of UserRouter is here
const jwt = require('jsonwebtoken');
let JWT_SECRET_KEY = "sdjr8ere09u" //random (our choice)
let bcrypt = require('bcrypt');

let userModel = require('../models/userModel');

//Website is now protected
// if loggedIn -> set
module.exports.getUser = async function getUser(req, res) {

    let token = req.cookies.isLoggedIn      //∵the cookie is jwt cookie (token)
    if (token) {
        // console.log(token);
        let payLoad = jwt.verify(token, JWT_SECRET_KEY);
        let id = payLoad.payload;
        let user = await userModel.findOne({ _id: id }) // Id in our DB-> _id 🔑

        return res.json({
            message: "your data",
            user: user
        })

    }

    return res.json({
        message: "Operation not allowed",
    })

}

module.exports.postUser = async function postUser(req, res) {
    data = req.body
    let user = await userModel.create(data)

    res.json({
        message: "data received successfully",
        yourDataInDB: user
    })
}

module.exports.updateUser = async function updateUser(req, res) {
    try {
        let newData = req.body //new data
        let id = req.params.id; //this is from parameters of route
        console.log(id);
        let user = await userModel.findOne({ _id: id })

        if (user) { // user isn't null
            // console.log(user);
            for (let key in newData) {
                if (key === 'confirmPassword') {
                    let isPasswordCorrect = await bcrypt.compare(newData[key], user.password);
                    // console.log("confirmpass: ", isPasswordCorrect);
                    if (isPasswordCorrect) {
                        user[key] = user.password;
                    }
                    else {
                        return res.json({ message: "Password do not match" })
                    }
                }
                else {
                    user[key] = newData[key]
                }

                // console.log(key, user[key]);
            }
            await user.save() // apna document save हो जायेगा
            res.json({
                message: "data updated successfully",
                user: user
            })
        }
        else { //user := null
            res.json({
                message: "user not found",
            })
        }
    } catch (err) {
        res.json({ message: err.message })
    }
}

module.exports.deleteUser = async function deleteUser(req, res) {
    try {
        let id = req.params.id;
        let user = userModel.findone({ id: id })
        if (user) {
            userModel.findOneAndDelete({ id: id });
            res.send("deleted successfully")
        }
        else res.send("user not found")
    } catch (err) { res.json({ message: err.message }) }
}

module.exports.getAllUser = function getAllUser(req, res) {
    try {
        let users = userModel.find();
        if (users) {
            res.json({ messages: "All users received", users: users })
        }
        else res.send("no user found")
    } catch (err) { res.json({ messagee: err.message }) }
}


module.exports.setCookies = function setCookies(req, res) {
    // res.setHeader('Set-Cookie', 'isLoggedIn=true')  //http method
    // res.cookie("isLoggedIn", false) //cookie-parser 's method
    res.cookie("isLoggedIn", false, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true }) //☠️ expire after 1 day
    //🔐 not accesible from console i>e> document.cookie😜
    res.send("cookie is set")
}

module.exports.getCookies = function getCookies(req, res) {
    let cookies = req.cookies;
    console.log(cookies);
    res.send("cookies received");
}