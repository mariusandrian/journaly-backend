const messageRepository = require('../repositories/messageRepository');
const httpResponseFormatter = require('../formatters/httpResponse');

module.exports = {
    // get all messages of current user
    async getAll(req, res) {
        if (req.session.userId) {
            const messages = await messageRepository.findAll();

            const currentUserMessages = messages.filter(item => item.users.includes(req.session.userId));

            httpResponseFormatter.formatOkResponse(res, currentUserMessages);
        } else {
            httpResponseFormatter.formatOkResponse(res, {
                message: "User should log in to able to access to database"
            });
        }
    },
    // create a chat room
    async createChatRoom(req, res) {
        try {
            const newChatRoom = await messageRepository.create(req.body);
            httpResponseFormatter.formatOkResponse(res, newChatRoom);
        } catch (err) {
            httpResponseFormatter.formatOkResponse(res, {
                err: err.message
            });
        }
    },
    // update new message to chat room
    async updateById(req, res) {
        const isUpdateSuccessful = await messageRepository.updateById(req.params.id_chat_room, req.body);
        httpResponseFormatter.formatOkResponse(res, {
            isUpdateSuccessful,
        });
    },
    // get one chat room
    async getById(req, res) {
        const oneChatRoom = await messageRepository.findById(req.params.id_chat_room);
        httpResponseFormatter.formatOkResponse(res, oneChatRoom);
    }   
}