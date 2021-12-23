let express = require('express');
let userRouter = express.Router();
let userModel = require('../models/userModel');
let protectRoute = require('./authHelper');
const { getUser, postUser, updateUser, deleteUser, getUserById, setCookies, getCookies } = require('../controller/userController')

userRouter
    .route('/')
    .get(protectRoute, getUser)  //🔐middleware function
    .post(postUser)
    .patch(updateUser)
    .delete(deleteUser)

//--------------------------------------------Cookies--------------------------------(keep it before userById)
userRouter
    .route('/setCookie')
    .get(setCookies)
userRouter
    .route('/getCookie')
    .get(getCookies)
//-----------------------------------------------------------------------------------


userRouter
    .route('/:id')      // ₹ from parameter = a single get/post route can handle crores of request by id/username
    .get(getUserById)






module.exports = userRouter;