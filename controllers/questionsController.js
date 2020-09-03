const questionsRepository = require('../repositories/questionsRepository');
const httpResponseFormatter = require('../formatters/httpResponse');

module.exports = {
    async create(req, res) {
        try {
            const newQuestion = await questionsRepository.create(req.body);
            httpResponseFormatter.formatOkResponse(res, newQuestion);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    async findOne(req, res) {
        try {
            const question = await questionsRepository.findOne();
            httpResponseFormatter.formatOkResponse(res, question);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err
            });
        }
    },
    async updateById(req, res) {
        const result = await entriesRepository.updateById(req.params.id, req.body);
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
};