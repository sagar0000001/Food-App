// All the Logic of UserRouter is here

let userModel = require('../models/userModel');

//Website is now protected
// if loggedIn -> set
module.exports.getUser = async function getUser(req, res) {
    // let user = await userModel.findOne({ email: "sagar@gmail.com" })
    let user = await userModel.findOne({ email: "bharat@gmail.com" })
    res.json({
        message: "your data",
        user: user
    })


    // let allUsers = await userModel.find()
    // res.json({
    //     message: "all users in our database",
    //     data: allUsers
    // })

    // res.send(user)
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
    let data = req.body
    let user = await userModel.findOneAndUpdate({ email: "sagar@gmail.com" }, data)

    res.json({
        message: "data updated successfully",
        user: user
    })
    /* when we have users stored on server itsels as users[] */
    // for (key in data) {
    //     data[key] = data[key]
    // }
    // res.send("data updated successfully")

}

module.exports.deleteUser = async function deleteUser(req, res) {
    let user = await userModel.findOneAndDelete({ email: "sagar@gmail.com" })
    // data = {}
    res.send("deleted successfully")
}

module.exports.getUserById = function getUserById(req, res) {
    let paramId = req.params.id
    let obj = {};
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == paramId) {
            obj = users[i];
        }
    }

    res.json({
        message: "data received successfully",
        data: obj
    })
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