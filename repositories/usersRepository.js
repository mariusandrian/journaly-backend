const db = require('../db');
const { ObjectId } = require('mongodb');
// const nodemailer = require('nodemailer');

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
    async updateById (id, newData) {
        // const { result } = await db.users.updateOne(
        //     { _id: ObjectId(id) },
        //     { $set: newData }
        // );
        // return !!result.nModified;
        const result = await db.users.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: newData },
            { returnNewDocument: true }
        );
        console.log(result);
        return { result: result.lastErrorObject, updatedDocument: result.value };
    },
    async findById (id) {
        const [result] = await doFindMany({ _id: ObjectId(id) });
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
    async likeUser (currentUserId, likedUser) {
        const likedUserObject = await db.users.findOne(
            { _id: ObjectId(likedUser._id)},
            {projection: {userName: 1}}
        )

        const result = await db.users.findOneAndUpdate(
            { _id: ObjectId(currentUserId) },
            { $addToSet: { 
                likes: likedUser._id , 
                notifications: {
                    type: "like",
                    target: likedUserObject,
                }
            }},
            { returnNewDocument: true }
            );
        // if (!result) {
        //     console.log('waiting for result');
        //     await result;
        // } else {
        //     // Do Matching

        //     const likedUsers = await db.users.findOne(
        //         { _id: ObjectId(currentUserId) },
        //         { projection: {_id:0, likes:1}}
        //         );
        //     let likedUsersArray = likedUsers.likes;
        //     const matchResult = await this.findMatch(currentUserId, likedUsersArray);

        // }
        return result;
        
    },
    async findMatch(currentUserId, likedUser) {
        const action = "match";
        let isUserLikedBack = false;

        const result = await db.users.findOne(
            { _id: ObjectId(likedUser) },
            { projection: { likes: 1, userName: 1, image: 1}}
        );

        // Get current user name and image
        const currentUserResult = await db.users.findOne(
            { _id: ObjectId(currentUserId) },
            { projection: { userName:1, image: 1 }}
        );

        const currentUserNotification = {
            _id: result._id,
            userName: result.userName
        }

        const likedUserNotification = {
            _id: currentUserResult._id,
            userName: currentUserResult.userName
        }

        result.likes.forEach((user) => {
            if (user === currentUserId) {
                isUserLikedBack = true;
                this.updateNotifications(ObjectId(currentUserId), action, currentUserNotification);
                this.updateNotifications(ObjectId(likedUser),action, likedUserNotification);
            }
        });
        return { 
            currentUserName: currentUserResult.userName,
            currentUserImage: currentUserResult.image,
            currentUserId: currentUserId,
            likedUserName: result.userName,
            likedUserImage: result.image,
            likedUserId: result._id,
            isUserLikedBack }
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