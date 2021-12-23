// All the Logic of UserRouter is here

let userModel = require('../models/userModel');

//Website is now protected
// if loggedIn -> set
module.exports.getUser = async function getUser(req, res) {
    let id = req.params.id;
    let user = await userModel.findOne({ id: id })

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
    try {
        let newData = req.body //new data
        let id = req.params.id;
        let user = await userModel.findOne({ id: id })

        if (user) { // user isn't null
            for (let key in newData) {
                user[key] = newData[key]
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
            res.json({ message: "All users received", users: users })
        }
        else res.send("no user found")
    } catch (err) { res.json({ message: err.message }) }
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