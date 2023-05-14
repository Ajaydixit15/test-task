const mongoose=require('mongoose')
const movieschema=new mongoose.Schema({
    tconst:{
        type:String 
    },
    titleType:{
        type:String 
    },
    primaryTitle:{
        type:String
    },
    runtimeMinutes:{
        type:Number
    },
    genres:{
        type:String
    }
    
    
})

const Movie=new mongoose.model('Movie',movieschema);

module.exports=Movie;
