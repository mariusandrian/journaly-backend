const db = require('../db');
const { ObjectId } = require('mongodb');


const doFindMany = async condition => {
   const data = await db.entries.find(condition).toArray()
   return data
};

module.exports = {
    findAll () {
        return doFindMany({});
    },
    async create (data) {
        const { ops: [newOne] } = await db.entries.insertOne(data);
        return newOne;
    },
    async updateById (id, newData) {
        const result = await db.entries.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: newData },
            { returnNewDocument: true }
        );
        return { result: result.lastErrorObject, updatedDocument: result.value };
    },
    async findByUserId (id) {
        const [result] = await doFindMany({ user_id: id });
        return result;
    },
    async deleteById (id) {
        const { result } = await db.entries.deleteOne({
            _id: ObjectId(id),
        }).toArray();
        return !!result.n;
    },
    async getTopFive (id) {
        const result = await db.entries.aggregate([
            // { $match: { user_id: id }},
            { $sample: { size: 5 }}
        ],
        {explain: true});
        console.log(result);
        return result;
    },
    // Post replies
    async replyToEntry (entryId, payload) {
        const result = await db.entries.findOneAndUpdate(
            { _id: ObjectId(entryId) },
            { $addToSet: { 
                replies: {
                    user_id: payload.userId,
                    username: payload.username,
                    content: payload.content,
                    date: new Date()
            }}},
            { returnOriginal: false }
            );
        console.log(result);
        return result;
    },
    async updateNotifications(currentUserId, action, payload) {
        const result = await db.users.findOneAndUpdate(
            { _id: ObjectId(currentUserId) },
            { $addToSet: { 
                notifications: {
                    type: action,
                    target: payload,
                }
            }},
            { returnNewDocument: true }
        );
        return result;
    },
};