const db = require('../db');
const { ObjectId } = require('mongodb');

const doFindMany = async condition => {
   const data = await db.chat_room.find(condition).toArray()
   return data
};

module.exports = {
    async create (data) {
        if (!('isCompleted' in data)) data.isCompleted = false;
        const { ops: [newOne] } = await db.chat_room.insertOne(data);
        return newOne;
    },
    findAll () {
        return doFindMany({});
    },
    async updateById (id, newData) {
        const { result } = await db.chat_room.updateOne(
            { _id: ObjectId(id) },
            { $set: newData }
        );
        return !!result.nModified;
    },
    async findById (id) {
        const [result] = await doFindMany({ _id: ObjectId(id) });
        return result;
    }
}