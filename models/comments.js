var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
    text : String,
    createdDate : {type:Date,default:Date.now},
    author : {
        id : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    username :String,
    image :String  
}
});



module.exports = mongoose.model("Comments",CommentsSchema);