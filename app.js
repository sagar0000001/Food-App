let express = require('express');
let cookieParser = require('cookie-parser');
let app = express();
let userRouter = require('./Routers/userRouter');
let authRouter = require('./Routers/authRouter');
app.use(express.json()); // global middleware funcn
app.use(cookieParser()); // global middleware funcn ∵ we want to access the cookie from anywhere
app.listen(3000); //🚀

app.use('/auth', authRouter); // 🚀global middleware funcn
app.use('/user', userRouter); // 🚀glabal


//---------404----------
app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', { root: __dirname })
})

