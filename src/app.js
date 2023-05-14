const express=require("express")
const multer=require('multer')
const fs=require('fs')
const path=require('path')
const csv=require('fast-csv')
const port= process.env.PORT||3000;
const app=express()
 require('./db/conn')
const Movie=require('./models/tschema')
const Rating=require('./models/rschema')
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./uploads')
    },
    filename: function(req,file,cb){
return cb(null,`${file.originalname}`);
    }
})

 const upload=multer({storage});

const allrecord=[];
const allrating=[];
// home page
app.get("/",(req,res)=>{
res.sendFile(__dirname+"/index.html");

})


app.post("/upload",upload.fields([{name:'movies'},{name:'ratings'}]),async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    
    try{
        fs.createReadStream(path.join(__dirname,"./uploads/movies.csv")).pipe(csv.parse({headers:true})).on("error",err=>console.log(err))
        .on("data",row=>{allrecord.push(row)})
        .on("end", async rowcount=>{
            console.log(`${rowcount} row has parsed`);
    try{
        const user=await Movie.insertMany(allrecord);
        
        res.status(201).json({
            message:"successful movie upload"
        })
    
    }

    catch(e){
res.status(400).json(e)
    }
})
//secon file
fs.createReadStream(path.join(__dirname,"./uploads/ratings.csv")).pipe(csv.parse({headers:true})).on("error",err=>console.log(err))
.on("data",row=>{allrating.push(row)})
.on("end", async rowcount=>{
    console.log(`${rowcount} row has parsed`);
try{
const user=await Rating.insertMany(allrating);

//res.status(201);
//res.send("ratin file succesfully upload");
 

}

catch(e){
res.status(400).send(e);
}
})
res.sendFile(__dirname+"/success.html");
    
    }
    catch(e){

        res.status(400).send(e);
    }
    
})
app.get("/api/v1/longest-duration-movies",async (req,res)=>{
    try{
        const longmovie= await Movie.find().sort({runtimeMinutes:-1}).limit(10)
        res.status(201).send(longmovie);
    }catch(e){
        console.log(e);
    }
})
app.get('/api/v1/top-rated-movies',async(req,res)=>{
    try{
        const toprated=await Rating.find({averageRating:{$gt:6}})
        res.send(toprated);
    }catch(e){
        console.log(e)
    }
})
app.get("/api/v1/genre-movies-with-subtotals",async(req,res)=>{
    try{
        const j=await Movie.aggregate([
            {
                $lookup:{
                    from:'ratings',
                    localField:'tconst',
                    foreignField:'tconst',
                    as : 'numvote'
                }

                
            }])
            res.send(j);
          

    }catch(e){
res.send(e)
    }
})

app.post('/api/v1/new-movie',async(req,res)=>{
       try
         {console.log("inside post");
         console.log(req.body);
         const create= new Movie(req.body);
         const insert= await create.save();
         res.status(201).send("success");
    
         }
         catch(e){
             res.send(e).status(400);
         }
     })
//done

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})