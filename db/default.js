const { MongoClient } = require('mongodb');

const DB_NAME = process.env.DB_NAME || 'journaly';;
const COLLECTIONS = {
    USERS: 'users',
    ENTRIES: 'entries',
};
const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

const entrySchema = require('./entrySchema');
const userSchema = require('./userSchema');

module.exports = {
    async connect () {
        const connection = await client.connect();
        console.log('Connected to Mongo');
        const db = connection.db(DB_NAME);
       
        await db.createCollection(COLLECTIONS.ENTRIES, entrySchema);
        await db.createCollection(COLLECTIONS.USERS, userSchema);
        
        // db.collection(COLLECTIONS.USERS).createIndex({"email": 1}, {unique: true});
        
        this.entries = db.collection(COLLECTIONS.ENTRIES);
        this.users = db.collection(COLLECTIONS.USERS);
    },
    disconnect () {
        return client.close();
    },
};
