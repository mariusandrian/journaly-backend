const db = require('../db');
const { ObjectId } = require('mongodb');

const doFindMany = async condition => {
   const data = await db.questions.find(condition).toArray()
   return data
};

module.exports = {
    findAll () {
        return doFindMany({});
    },
    async findOne () {
        const result = await doFindMany({});
        console.log(result);
        // Logic to get 'randomized' question
        let today = new Date();
        let todayDate = today.getDate();
        let questionIndex = Math.floor((todayDate/31) * result.length);
        return result[questionIndex];
    },
    async create (data) {
        const { ops: [newOne] } = await db.questions.insertOne(data);
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
        const result = await doFindMany({ user_id: id });
        return result;
    },
    async findByEntryId (id) {
        const result = await db.entries.findOne({ _id: ObjectId(id) });
        return result;
    },
    async deleteById (id) {
        const result = await db.entries.deleteOne({
            _id: ObjectId(id),
        })
        return result;
    },
};