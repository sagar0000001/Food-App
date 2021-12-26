let express = require('express');
let userRouter = express.Router();
// let userModel = require('../models/userModel');
const { getUser, postUser, updateUser, deleteUser, getAllUser, setCookies, getCookies } = require('../controller/userController')
const { signup, login, isAuthorisedFor, protectRoute } = require('../controller/authController')

// console.log(protectRoute);
// console.log(signup);

let app = express();

// user options
userRouter
    .route('/:id')
    .patch(updateUser)
    .delete(deleteUser)


userRouter
    .route('/signup')
    .post(signup)

userRouter
    .route('/login')
    .post(login)




// profile page
userRouter.use(protectRoute) //Before providing User-details. This middleware will work for all the calls defined below it (for safety)
userRouter
    .route('/profile')
    .get(getUser)



//Administration route 🔐( because written in the last of all the user-routes )
userRouter.use(isAuthorisedFor(['admin'])) //This middleware will work for all the calls defined below
// req, res are handled inside app.use()
// we pass callback fun to app.use(cb) consist of req, res, next
userRouter
    .route('/allUsers')
    .get(getAllUser)


module.exports = userRouter;