const { MongoClient } = require('mongodb');

const DB_NAME = process.env.DB_NAME || 'journaly';;
const COLLECTIONS = {
    USERS: 'users',
    ENTRIES: 'entries',
    COMMUNITYPOST: 'communitypost',
    QUESTIONS: 'questions'
};
const MONGO_URL = process.env.MONGO_URI || 'mongodb+srv://admin:qAxfYfp8HHhEnCvL@cluster0-ijy0t.mongodb.net/journaly?retryWrites=true&w=majority';

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

const entrySchema = require('./entrySchema');
const userSchema = require('./userSchema');
const communityPostSchema = require('./communityPostSchema');
const questionSchema = require('./questionsSchema');

module.exports = {
    async connect () {
        const connection = await client.connect();
        console.log('Connected to Mongo');
        const db = connection.db(DB_NAME);
       
        await db.createCollection(COLLECTIONS.ENTRIES, entrySchema);
        await db.createCollection(COLLECTIONS.USERS, userSchema);
        await db.createCollection(COLLECTIONS.COMMUNITYPOST, communityPostSchema);
        await db.createCollection(COLLECTIONS.QUESTIONS, questionSchema);
        
        // db.collection(COLLECTIONS.USERS).createIndex({"email": 1}, {unique: true});
        
        this.entries = db.collection(COLLECTIONS.ENTRIES);
        this.users = db.collection(COLLECTIONS.USERS);
        this.communityPost = db.collection(COLLECTIONS.COMMUNITYPOST);
        this.questions = db.collection(COLLECTIONS.QUESTIONS);
    },
    disconnect () {
        return client.close();
    },
};
