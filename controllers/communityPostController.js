const communityPostRepository = require('../repositories/communityPostRepository');
const httpResponseFormatter = require('../formatters/httpResponse');

module.exports = {
    async findPostsByQuestionId(req, res) {
        try {
            const posts = await communityPostRepository.findByQuestionId(req.params.id);
            httpResponseFormatter.formatOkResponse(res, posts);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                message: "User should be able to get all posts"
            });
        }
    },
    async replyToEntry(req, res) {
        try {
            const result = await communityPostRepository.replyToEntry(req.params.id, req.body);
            httpResponseFormatter.formatOkResponse(res, result);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    // async getByUserId(req, res) {
    //     const oneUser = await entriesRepository.findByUserId(req.params.id);
    //     httpResponseFormatter.formatOkResponse(res, oneUser);
    // },
    async createPost(req, res) {
        try {
            const newPost = await communityPostRepository.createPost(req.body);
            httpResponseFormatter.formatOkResponse(res, newPost);
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
    
    async likeUser(req, res) {
        const isUpdateSuccessful = await usersRepository.likeUser(req.params.id, req.body);
        httpResponseFormatter.formatOkResponse(res, {
            isUpdateSuccessful,
        });
    },
};