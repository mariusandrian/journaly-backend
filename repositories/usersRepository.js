const db = require('../db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const httpResponseFormatter = require('../formatters/httpResponse');

const doFindMany = async condition => {
   const data = await db.users.find(condition).toArray()
   return data
};

module.exports = {
    async create (data) {
        // if (!('isCompleted' in data)) data.isCompleted = false;
        const { ops: [newOne] } = await db.users.insertOne(data);
        return newOne;
    },
    async findOne (username, password, done) {
        const user = await db.users.findOne({
            username: username
        })
        console.log('findOne returns', user);
        try {
            if (!user) {
                console.log('no user found');
                return done(null, false);
            }
            bcrypt.compare(password, user.password, (err, result) => {
                console.log('bcrypt error is', err);
                console.log('bcrypt result is', result);
                if (err) throw err;
                if (result) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            });
        } catch (err) {
            throw new Error(`Unable to find account due to ${err.message}`);
        }
    },
    async updateById (id, newData) {
        const result = await db.users.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: newData },
            { returnNewDocument: true }
        );
        console.log(result);
        return { result: result.lastErrorObject, updatedDocument: result.value };
    },
    async findById (id) {
        const result = await db.users.findOne({_id: ObjectId(id)});
        return result;
    },
    async sendMail (userId, payload) {
        const result = await db.users.findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $addToSet: { 
                inbox: {
                    user_id: payload.user_id,
                    username: payload.username,
                    content: payload.content,
                    date: payload.date,
                    timestamp: new Date()
            }}},
            { returnOriginal: false }
            );
        console.log(result);
        return result;
    },
    async findMailsById (userId) {
        const result = await db.users.findOne({ _id: ObjectId(userId) })
        console.log(result.inbox);
        return result.inbox;
        
    },
    async getOneByEmail (email) {
        const [result] = await doFindMany({email: email});
        if (!result) throw new Error(`User with email '${email}' does not exist`);
        return result;
    },
    findAll () {
        return doFindMany({});
    },
    async deleteById (id) {
        const { result } = await db.users.deleteOne({
            _id: ObjectId(id),
        });
        return !!result.n;
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
    async sendPasswordResetEmail(userEmail, password){
        const senderEmailAddress = 'datingapprml@gmail.com';
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: senderEmailAddress,
                pass: 'RMLgroup!23'
            }
        });
        let mailOptions = {
            from: senderEmailAddress,
            to: userEmail,
            subject: `Dating App - Password Reset For ${userEmail}`,
            text: 'You are receiving this because you (or someone else) have requested the reset of your account password.' + '\n\n' + `Your new password is: ${password}`
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            return `Password Reset Email sent successfully to ${userEmail}`;
        } catch(err) {
            console.log(err);
        }
        
    }
};