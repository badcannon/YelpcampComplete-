var mongoose = require('mongoose');
var Campgrounds = require('./models/campgrounds');
var Comments = require('./models/comments');
var Users = require("./models/user");


async function SeedDB(){
    try{
    await Campgrounds.deleteMany({});
    await Comments.deleteMany({});
    // await Users.deleteMany({});
}
catch(err){
    console.log(err);
}


}

module.exports = SeedDB;






// function SeedDB(){

//     // remove all campgrounds :
//     Campgrounds.remove({},function(err,camps){
//         if(err){
//             console.log("Error!");
//         }
//         else {
//             console.log("Campgrounds removed !");
//             // Create New CampGrounds : 
//             data.forEach((seed)=>{
//                 Campgrounds.create(seed,function(err,camp){
//                     if(err){
//                         console.log("Error!!!!");

//                     }
//                     else{
//                         console.log("Campground Created !");
//                         // Create Comments Here !
//                         Comments.create({
//                             text: "Loved it in here had sex twice inside my camp no one noticed :D ",
//                             author : "Brad Scott"
//                         },function(err,com){
//                             if(err){
//                                 console.log("ERROR HELP !!");
//                             }
//                             else {
//                                 camp.comment.push(com);
//                                 camp.save();
//                             }

//                         }); 
//                     }
//                 });
//             });

//         }
//     });


// }