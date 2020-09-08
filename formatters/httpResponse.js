const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NOTFOUND: 404,
    WRONGAUTH: 401,
    SERVERERR: 500,
    BADGATEWAY: 502,
    GATEWAYTIMEOUT: 504,
    UNPROCESSABLE: 422
};

module.exports = {
    formatOkResponse (res, payload) {
        res.status(HTTP_STATUS_CODES.OK)
            .json({
                status: 'ok',
                data: payload,
            });
    },
    formatUserErrResponse (res, payload, errorMessage) {
        res.status(HTTP_STATUS_CODES.WRONGAUTH)
            .json({
                status: 'not found',
                error: errorMessage
            })
    }
};