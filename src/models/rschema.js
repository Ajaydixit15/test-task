const mongoose=require('mongoose')

const ratingschema=new mongoose.Schema({
    tconst:{
        type:String 
    },
    averageRating:{
        type:Number
    },
    numVotes:{
        type:Number
    }
    
})

const Rating=new mongoose.model('Rating',ratingschema);
module.exports=Rating;