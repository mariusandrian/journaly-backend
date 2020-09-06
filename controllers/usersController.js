const usersRepository = require('../repositories/usersRepository');
const httpResponseFormatter = require('../formatters/httpResponse');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const { likeUser } = require('../repositories/usersRepository');
const nodemailer = require('nodemailer');
const passport = require("passport");

module.exports = {
    login(req, res, next) {
        console.log('reqbody',req.body)
        passport.authenticate("local", (err, user, info) => {
            console.log('authenticating user ' , user);
            if (err) throw err;
            if (!user) {
                httpResponseFormatter.formatUserErrResponse(res, null, "Incorrect Username or Password")
                // res.status(400).send("Incorrect Username or Password");
            } else {
            req.logIn(user, function (err) {
              if (err) return next(err);
              console.log('login successful');
              res.status(201).send(JSON.stringify(user));
            })
          }
        })(req, res, next);
      },
    async getAll(req, res) {
        if (req.session.userId) {
            const users = await usersRepository.findAll();
            httpResponseFormatter.formatOkResponse(res, users);
        } else {
            httpResponseFormatter.formatOkResponse(res, {
                message: "User should log in to able to access to database"
            });
        }
    },
    // For Passport deserialize --------------------------
    async getById(req, res) {
        try {
            const oneUser = await usersRepository.findById(req.params.id);
            return oneUser;
        } catch (err) {
            return err;
        }
    },
    // For getting client info upon loading component ----------
    getDetails(req, res) {
        console.log('req.session is ', req.session);
        console.log('req.user is ', req.user);
        res.send(req.session);
    },

    async create(req, res) {
        try {
            req.body.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            const newUser = await usersRepository.create(req.body);
            httpResponseFormatter.formatOkResponse(res, newUser);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: "This email is used already. Please use another one."
            });
        }

    },
    async updateById(req, res) {
        // const isUpdateSuccessful = await usersRepository.updateById(req.params.id, req.body);
        const result = await usersRepository.updateById(req.params.id, req.body);
        httpResponseFormatter.formatOkResponse(res, result);
    },
    async deleteById(req, res) {
        const isDeleteSuccessful = await usersRepository.deleteById(req.params.id);
        httpResponseFormatter.formatOkResponse(res, {
            isDeleteSuccessful,
        });
    },
    async findMailsById(req, res) {
        const result = await usersRepository.findMailsById(req.params.id);
        httpResponseFormatter.formatOkResponse(res, result);
    },
    async sendMail(req, res) {
        try {
            const result = await usersRepository.sendMail(req.params.id, req.body);
            httpResponseFormatter.formatOkResponse(res, result);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    async uploadAvatar(req, res, next) {
        try {
            let url = '';
            console.log(req);
            /// CLOUDINARY
            await cloudinary.uploader.upload(req.file.path,
                async function (error, result) {
                    url = result.url;
                }
            )
            httpResponseFormatter.formatOkResponse(res, {
                url,
            });
        } catch (error) {
            console.log(error);
        }

    },
    async likeUser(req, res) {
        const isUpdateSuccessful = await usersRepository.likeUser(req.params.id, req.body);
        httpResponseFormatter.formatOkResponse(res, {
            isUpdateSuccessful,
        });
    },
    async matchUser(currentUser, likedUser) {
        const isUserMatched = await usersRepository.findMatch(currentUser, likedUser);
        return isUserMatched;
    },

    async resetPassword(req, res) {
        try {
            const user = await usersRepository.getOneByEmail(req.body.email);
            console.log('Req body', req.body);
            const randomPassword = Math.random().toString(36).slice(-10);
            const encryptedNewPassword = bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10));
            
            // Update Password and Send Out Password Reset Email
            try {
                const updatedUser = await usersRepository.updateById(user._id, { password: encryptedNewPassword});
                
                const response = await usersRepository.sendPasswordResetEmail(req.body.email, randomPassword);
                console.log(response);
                httpResponseFormatter.formatOkResponse(res, { message: `Reset Password Email has been sent to ${req.body.email}`});
            } catch(err) {
                console.log(err);
            }
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: "This email address does not exist."
            });
        }
    },
    async findOne(req, res) {
        try {
            const result = await usersRepository.findOne(req.body);
            httpResponseFormatter.formatOkResponse(res, result);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    
};