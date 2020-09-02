const entriesRepository = require('../repositories/entriesRepository');
const httpResponseFormatter = require('../formatters/httpResponse');

module.exports = {
    async getAll(req, res) {
        if (req.session.userId) {
            const entries = await entriesRepository.findAll();
            httpResponseFormatter.formatOkResponse(res, users);
        } else {
            httpResponseFormatter.formatOkResponse(res, {
                message: "User should be able to get all entries"
            });
        }
    },
    async getByUserId(req, res) {
        const oneUser = await entriesRepository.findByUserId(req.params.id);
        httpResponseFormatter.formatOkResponse(res, oneUser);
    },
    async getByEntryId(req, res) {
        const oneEntry = await entriesRepository.findByEntryId(req.params.id);
        httpResponseFormatter.formatOkResponse(res, oneEntry);
    },
    async create(req, res) {
        try {
            const newEntry = await entriesRepository.create(req.body);
            httpResponseFormatter.formatOkResponse(res, newEntry);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }

    },
    async updateById(req, res) {
        // const isUpdateSuccessful = await usersRepository.updateById(req.params.id, req.body);
        const result = await entriesRepository.updateById(req.params.id, req.body);
        console.log(result);
        httpResponseFormatter.formatOkResponse(res, result);
    },
    async deleteById(req, res) {
        const isDeleteSuccessful = await entriesRepository.deleteById(req.params.id);
        httpResponseFormatter.formatOkResponse(res, {
            isDeleteSuccessful,
        });
    },
    async getTopFive(req, res) {
        try {
            const result = await entriesRepository.getTopFive(req.params.id);
            httpResponseFormatter.formatOkResponse(res, result);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    async replyToEntry(req, res) {
        try {
            const result = await entriesRepository.replyToEntry(req.params.id, req.body);
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
};