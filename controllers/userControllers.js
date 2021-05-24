const User = require("../models/user")
const jwt = require("jsonwebtoken")

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate")


exports.signupController = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.statusCode = 500
        res.send({
            name: "Error",
            message: "All the input are required",
        })
    } else {
        const user = new User({ firstName, lastName, email, password });
        user.save().then((savedUser) => {
            const refreshToken = getRefreshToken({ _id: savedUser._id })
            res.status(201).send({ success: true, savedUser, refreshToken })
        }).catch(e => {
            return res.status(400).send({ success: false, message: e })
        })
    }
}

exports.loginController = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email, password }).then(
        user => {
            const refreshToken = getRefreshToken({ _id: user._id })
            return res.send({ success: true, refreshToken, user })
        }
      
    ).catch(e=>{
       return res.status(401).send("User Not Found")
    })
}

exports.refreshToken = (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            User.findOne({ _id: userId }).then(
                user => {
                    if (user) {
                        const tokenIndex = user.refreshToken.findIndex(
                            item => item.refreshToken === refreshToken
                        )
                        if (tokenIndex === -1) {
                            res.statusCode = 401
                            res.send("Unauthorized")
                        } else {
                            const token = getToken({ _id: userId })
                            const newRefreshToken = getRefreshToken({ _id: userId })
                            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500
                                    res.send(err)
                                } else {
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                                    res.send({ success: true, token, user })
                                }
                            })
                        }
                    } else {
                        res.statusCode = 401
                        res.send("Unauthorized")
                    }
                },
                err => next(err)
            )
        } catch (err) {
            res.statusCode = 401
            res.send("Unauthorized")
        }
    } else {
        res.statusCode = 401
        res.send("Unauthorized")
    }
}