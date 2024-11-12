const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const PostModel = require("./models/Posts.js")

const app = express()
const port = 8080
const url = "mongodb+srv://VaibhavPareek:vi515vai@cluster0.1m7skvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(cors({
    origin:true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(url)
  .then(() => console.log('Connected!'))
  .catch((err)=>console.log(err))

app.post("/addpost",async(req,res)=>{
    const {title,content}=req.body;
    const post = new PostModel({
        title:title,
        content:content
    })

    try {   
        await post.save()
    } catch(error) {console.log(error)}

    res.json({message:"Blog Added Successfully"})
})

app.get("/allpost",async(req,res)=> {
    const posts= await PostModel.find()
    res.json(posts)
})

app.post("/singlepost",async(req,res)=> {
    const {id}=req.body;
    try {
        const post = await PostModel.findById(id)
        res.json(post)
    }catch(err){console.log(err)}
})

app.listen(port,()=>{
    console.log("Server is running")
})