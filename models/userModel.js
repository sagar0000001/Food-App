let mongoose = require('mongoose');
let emailValidator = require('email-validator');
let bcrypt = require('bcrypt');
const { DB_LINK } = require('../secrets')


mongoose.connect(DB_LINK)
    .then(db => {
        console.log("db connected successfully")
    })
    .catch(err => {
        console.log("error on connecting db")
    })



let userSchema = mongoose.Schema({ /* ढाँचा 🏗️*/
    name: {
        type: "string",
        required: true, // not null
    },
    email: {
        type: "string",
        required: true,
        unique: true, // unique in column
        validate: function () {
            return emailValidator.validate(this.email); // we used the 3rd party package to validate email (syntax)
        }
    },
    password: {
        type: "string",
        required: true,
        minLength: 6,
    },
    confirmPassword: { // This will not gonna store in our DB; ∴ For User operations -> This will'be required
        type: "string",
        required: true,
        minLength: 6, // minimum length of string
        validate: function () {
            // console.log(this.password);
            // console.log(this.confirmPassword);
            return this.password == this.confirmPassword; //🚨 Confirm Password will'be required (from user) (As it is not stored in DB🔐)
        }
    },
    role: {
        type: "string",
        enum: ["admin", "user", "restarauntOwner", "deliveryBoy"],//Strings ka array (name by default in MongoDB = enum[]) 
        default: "user" // for role
    },
    profileImage: {
        type: "string", // ∵ using Multer to send image
        default: "../img/users/default.jpeg"
    }
})

//---------------------------------------- Hooks -------------------------------
userSchema.pre('save', async function () { // 😀before doing operation in database 
    // callback function =>
    let flag_alreadyHashed = this.password.length > 50;
    if (!flag_alreadyHashed) {

        //---------------------protecting password by Hashing-----------------------
        let salt = await bcrypt.genSalt(); // giving promise
        // console.log("salt : ", salt);
        let hashedString = await bcrypt.hash(this.password, salt);
        this.password = hashedString;
    }

    this.confirmPassword = undefined; //👈🏼 database donot store undefined properties
    // 🙄this i.e. doc (document inside mongoDb collection)

})

userSchema.post('save', function () {
    // callback function =>
    console.log("after saving into db");
})
//------------------------------------------------------------------------------


let userModel = mongoose.model('userModel', userSchema); // gaadi of our skeleton (Schema)(ढाँचा)

module.exports = userModel;