const usersController = require('../controllers/usersController');
const messageController = require('../controllers/messageController');
const sessionController = require('../controllers/session');
const entriesController = require('../controllers/entriesController');
const questionsController = require('../controllers/questionsController');
const communityPostController = require('../controllers/communityPostController');

// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


// cloudinary.config({
//     cloud_name: 'dt5rqi1l9',
//     api_key: '552321872584896',
//     api_secret: 'FC0feHoGttL0P8HFBDiZNWthplo'
// });

module.exports = app => {
    // Cannot work, to ask
    app.get('/top/:id', entriesController.getTopFive);

    // Entries
    app.get('/entries/:id', entriesController.getByUserId);
    app.get('/entries/edit/:id', entriesController.getByEntryId);
    app.delete('/entries/:id', entriesController.deleteById);
    app.put('/entries/reply/:id', entriesController.replyToEntry);// To be moved to user collection
    app.put('/entries/:id', entriesController.updateById);
    app.post('/entries', entriesController.create);

    // Community Daily Question
    app.get('/cty/feed/:id', communityPostController.findPostsByQuestionId)
    app.post('/cty/reply/:id', communityPostController.replyToEntry); 
    app.post('/cty/new', questionsController.create);
    app.get('/cty/question', questionsController.findOne);
    app.post('/cty/post', communityPostController.createPost);

    // Send reply to entry
    app.get('/mail/:id', usersController.findMailsById);
    app.put('/mail/:id', usersController.sendMail);

    // Users
    // User Signup
    app.post('/register', usersController.create);

    // User Login
    app.post('/login', usersController.login);
    app.get('/user', usersController.getDetails);

    // app.get('/', usersController.getAll);
    app.get('/logout', sessionController.logOut);

    // ----------------- FOR TEST ONLY ----------------
    // Find a user
    // app.get('/user', usersController.findOne); 
    // ----------------- FOR TEST ONLY ----------------

    // User Forgot Password
    // app.post('/forget-password', usersController.resetPassword);
    
    // check Authentication
    // app.get('/check_authentication', sessionController.checkAuthentication);
    
    // get ALL CHAT ROOMS
    // app.get('/chat_room', messageController.getAll);

    // app.get('/:id', usersController.getById);

    //GET ONE CHAT ROOM
    // app.get('/chat_room/:id_chat_room', messageController.getById);
    

    // log in with fb
    // app.post('/get_data_fb', sessionController.getDataFacebook);
    // app.post('/log_in_with_fb', sessionController.logInWithFacebookSubmit);

     // upload avata
    //  app.post('/avatar-upload', upload.single('file'), usersController.uploadAvatar);

    // create chat room
    // app.post('/chat_room', messageController.createChatRoom);
    // app.put('/:id', usersController.updateById);

    // add new message to a chat room 
    // app.put('/chat_room/:id_chat_room', messageController.updateById);

    // app.delete('/:id', usersController.deleteById);

   
    

    // like another user
    // app.put('/like/:id', usersController.likeUser);



};