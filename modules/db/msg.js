var mongoose = require('./connection');

var msgSchema = new mongoose.Schema({
    title:String,
    content:String,
    time:String,
    pageviews: {
		type: Number,
		default: 0
	},
    target:[],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    reples:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reply"
    }]

});

var Message = mongoose.model('msg',msgSchema);
module.exports = Message;