var mongoose = require('./connection');

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    headerurl:String    //头像的url
});

var User = mongoose.model('user',userSchema);

module.exports = User;