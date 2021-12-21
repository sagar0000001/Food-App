let mongoose = require('mongoose');
let emailValidator = require('email-validator');
let bcrypt = require('bcrypt');

const db_link = "mongodb+srv://sagaroshiv:MyPass1234@cluster0.vu99f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(db_link)
    .then(db => {
        console.log("db connected successfully")
    })
    .catch(err => {
        console.log("error on connecting db")
    })



let userSchema = mongoose.Schema({ /* ढाँचा */
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
    confirmPassword: {
        type: "string",
        required: true,
        minLength: 6, // minimum length of string
        validate: function () {
            return this.password == this.confirmPassword;
        }
    }
})

//---------------------------------------- Hooks -------------------------------
userSchema.pre('save', async function () { // before doing operation in database (there is no argument in callback func)
    this.confirmPassword = undefined; // database donot store undefined properties.  this = doc (document)

    //---------------------protecting password by Hashing-----------------------
    let salt = await bcrypt.genSalt(); // giving promise
    let hashedString = await bcrypt.hash(this.password, salt);
    this.password = hashedString;

})

userSchema.post('save', function () {
    console.log("after saving into db");
})
//------------------------------------------------------------------------------


let userModel = mongoose.model('userModel', userSchema); // gaadi of our skeleton(ढाँचा)

module.exports = userModel;