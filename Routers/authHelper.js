const jwt = require('jsonwebtoken');
let JWT_KEY = "sdjr8ere09u" //random (our choice)

//🔑logged in or not
// if logged out->🛑not granted to enter
// if logged in->🙏u are welcome
//So we'll use Cookies🍪
function protectRoute(req, res, next) {
    if (req.cookies.isLoggedIn) {
        let isVerified = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);
        if (isVerified) {
            next();
        }
        else {
            res.json({
                message: "user has no valid keys"
            })
        }
    }
    else { //there is no cookie stored named as 'isLoggedIn'
        res.json({
            message: "operation not allowed"
        })
    }

}

module.exports = protectRoute;