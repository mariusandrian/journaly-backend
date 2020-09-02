const usersRepository = require('../repositories/usersRepository');
const httpResponseFormatter = require('../formatters/httpResponse');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const { likeUser } = require('../repositories/usersRepository');
const nodemailer = require('nodemailer');

module.exports = {
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
    async getById(req, res) {
        const oneUser = await usersRepository.findById(req.params.id);
        httpResponseFormatter.formatOkResponse(res, oneUser);
    },
    async create(req, res) {
        try {
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
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
};