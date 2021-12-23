let express = require('express');
let userRouter = express.Router();
let userModel = require('../models/userModel');
let protectRoute = require('./authHelper');
const { getUser, postUser, updateUser, deleteUser, getAllUser, setCookies, getCookies } = require('../controller/userController')


// user options
userRouter
    .route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

// profile page
app.use(protectRoute) //this middleware will work for all the calls defined below it
userRouter
    .route('/userProfile')
    .get(getUser)

//Administration routes
app.use(isAuthorized(['admin'])) //This middleware will work for all the calls defined below
userRouter
    .route('')
    .get(getAllUser)


module.exports = userRouter;