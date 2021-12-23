//🔑logged in or not
// if logged out->🛑not granted to enter
// if logged in->🙏u are welcome
//So we'll use Cookies🍪
function protectRoute(req, res, next) {
    if (req.cookies.isLoggedIn) {
        next();
    }
    else {
        res.json({
            message: "operation not allowed"
        })
    }

}

module.exports = protectRoute;