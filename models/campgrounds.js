var mongoose = require("mongoose");



// Schema for campgrounds
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageID : String,
    description: String,
    price : String,
    location : String,
    latitude : Number,
    longitude : Number,
    createdDate : {type:Date , default:Date.now },
    likes :[ {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        count : {type:Number , default:0},
    }],
    author :{
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref :"User"
        },
        username : String,
        image:String
    },
    comment : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comments"
    }]
});

//  Model for the Campgrounds !
module.exports = mongoose.model("data", campgroundSchema);
