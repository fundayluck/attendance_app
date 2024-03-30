require('dotenv').config()
const User = require('../models/user')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET, EMAIL_PASS } = process.env
const bcrypt = require("bcrypt");


let smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "information.nimbu@gmail.com",
        pass: EMAIL_PASS
    }
})

module.exports = {
    createUser: async (req, res) => {
        const {
            email,
            password,
            id_staff,
            role
        } = req.body
        const creator = req.user
        try {
            const user = new User({
                email,
                password,
                id_staff,
                role
            })
            if (role === 'HR' && creator.role === 'HR') {
                res.status(400).send({
                    status: false,
                    message: "HR cannot create another HR"
                })
            } else if (creator.role === "STAFF") {
                res.status(400).send({
                    status: false,
                    message: "staff cannot create user"
                })
            } else {
                await user.save()
                res.status(200).send({
                    status: true,
                    data: user
                })
            }
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.email === 1) {
                return res.status(400).send({
                    status: false,
                    message: 'User email already exist!'
                })
            }
            if (error.code === 11000 && error.keyPattern.id_staff === 1) {
                return res.status(400).send({
                    status: false,
                    message: 'User staff of id already exist!'
                })
            }
            return res.status(400).send({
                status: false,
                message: error.message
            });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body
        try {
            if (!email || !password) {
                return res
                    .status(421)
                    .send({
                        status: false,
                        error: "username and password are required"
                    });
            }
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(422).send({
                    status: false,
                    error: "invalid password or email"
                });
            } else if (!user.is_active) {
                return res.status(422).send({
                    status: false,
                    error: 'This account no longer has login access!'
                })
            }
            await user.comparePassword(password)
            const accessToken = jwt.sign(
                { userId: user._id },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            res.status(200).send({
                status: true,
                token: accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    id_staff: user.id_staff
                }
            });
        } catch (error) {
            return res.status(422).send({
                status: false,
                error: "invalid password or email"
            });
        }
    },
    getAllUser: async (req, res) => {
        try {
            const user = await User.find({}).populate('id_staff')
            res.status(200).send({
                status: true,
                data: user
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.userId }).populate('id_staff')
            res.status(200).send({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    sendOTPIn: async (req, res) => {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (email === "") {
            return res.status(400).send({
                status: false,
                message: "some param missing!"
            });
        } else
            if (email !== req.user.email) {
                return res.status(400).send({
                    status: false,
                    message: "something when wrong!"
                });
            } else
                if (user) {
                    let code = Math.floor(100000 + Math.random() * 900000);
                    let message = "<h4>Hello, " + user.email + "</h4>" + "<h4>You are claiming that you have forgotten your password.</h4>" +
                        "<p>Please verify the verification code below to reset your password. Don't give this verification code to anyone else.</p><hr>" +
                        "<p>Staff Account: " + user.email + "</p><p>Verification Code: " + code + "</p><hr>" +
                        "<p>If this is not you, please change your password directly.</p><br>" +
                        "<p>Regards,</p><p>Staff Attendance</p>";
                    mailOptions = {
                        from: 'information.nimbu@gmail.com',
                        to: user.email,
                        subject: "[Attendance App] Forget your password?",
                        html: message,
                    }
                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                            return res.status(400).send({
                                status: false,
                                message: "Failed to send email!"
                            });
                        } else
                            if (response) {
                                const token = jwt.sign(
                                    {
                                        userId: user._id,
                                        code: code
                                    },
                                    ACCESS_TOKEN_SECRET,
                                    { expiresIn: '3m' }
                                );
                                return res.status(200).send({
                                    status: true,
                                    message: "Email sent!",
                                    token: token,
                                    code: code
                                });
                            }
                    })
                } else {
                    return res.status(400).send({
                        status: false,
                        message: "Email not registered!"
                    });
                }
    },
    sendOTPOut: async (req, res) => {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (email === "") {
            return res.status(400).send({
                status: false,
                message: "some param missing!"
            });
        } else
            if (user) {
                let code = Math.floor(100000 + Math.random() * 900000);
                let message = "<h4>Hello, " + user.email + "</h4>" + "<h4>You are claiming that you have forgotten your password.</h4>" +
                    "<p>Please verify the verification code below to reset your password. Don't give this verification code to anyone else.</p><hr>" +
                    "<p>Staff Account: " + user.email + "</p><p>Verification Code: " + code + "</p><hr>" +
                    "<p>If this is not you, please change your password directly.</p><br>" +
                    "<p>Regards,</p><p>Staff Attendance</p>";
                mailOptions = {
                    from: 'information.nimbu@gmail.com',
                    to: user.email,
                    subject: "[Attendance App] Forget your password?",
                    html: message,
                }
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error)
                        return res.status(400).send({
                            status: false,
                            message: "Failed to send email!"
                        });
                    } else
                        if (response) {
                            const token = jwt.sign(
                                {
                                    userId: user._id,
                                    code: code
                                },
                                ACCESS_TOKEN_SECRET,
                                { expiresIn: '3m' }
                            );
                            return res.status(200).send({
                                status: true,
                                message: "Email sent!",
                                token: token,
                                code: code
                            });
                        }
                })
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Email not registered!"
                });
            }
    },
    forgotPassword: async (req, res) => {
        const { newpassword, code } = req.body

        let tokenWithBearer = req.headers.authorization
        if (tokenWithBearer) {
            if (!newpassword || !code) {
                return res.status(400).send({
                    status: false,
                    message: "Some param missing"
                });
            }
            const token = tokenWithBearer.split(' ')[1];

            jwt.verify(
                token,
                ACCESS_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return res.status(401).send({
                            status: false,
                            message: 'Token is not registered or expired!'
                        });
                    } else {


                        let id = decoded.userId
                        let codeDecode = decoded.code
                        let newPassword = newpassword
                        let userCode = code

                        if (userCode.toString() === codeDecode.toString()) {

                            bcrypt.genSalt(10, (err, salt) => {
                                if (err) {
                                    return next(err);
                                }
                                bcrypt.hash(newPassword, salt, async (err, hash) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    let newPassword = hash;

                                    await User.updateOne(
                                        { _id: id },
                                        {
                                            password: newPassword
                                        }
                                    )

                                    res.status(200).send({
                                        status: true,
                                        message: 'Password changed!'
                                    })
                                });
                            });
                        } else {
                            return res.status(400).send({ status: false, message: 'Code is wrong!' });
                        }
                    }
                })
        } else {
            return res.status(401).send({
                status: false,
                message: 'Token header missing!'
            });
        }
    }
}




