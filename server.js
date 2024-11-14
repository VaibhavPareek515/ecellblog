const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const PostModel = require("./models/Posts.js")
const UserModel = require("./models/Users.js")

const app = express()
const port = 8080
const url = "mongodb+srv://VaibhavPareek:vi515vai@cluster0.1m7skvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(cors({
    origin:true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = 'lalalala1234@#$'

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

const auth = (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token) {
        res.json({message:"You need Token"})
    }else{
        jwt.verify(token,SECRET_KEY,(err,decode)=> {
            if(err) {
                res.json({message:"Not working brother"})
            }else{
                req.user=decode
                next()
            }
        })
    }
}

app.get("/protected", auth, (req,res)=> {
    res.json({message: req.user})
});

app.post("/adminregister",async (req,res)=> {
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new UserModel({
        username:username,
        password:hashedPassword,
    })
    try{
        await user.save()
    }catch(err){
        console.log("myErro"+err)
    }
    // users.push({username,password:hashedPassword})
    res.json({message:"User registerd successfully"});
})


app.post("/adminlogin",async(req,res)=> {
    const {username,password}=req.body
    const user = await UserModel.findOne({username:username})
    if(!user || !(await bcrypt.compare(password,user.password))) {
        return res.status(400).json({message:"Invalid username or password"});
    }
    const token = jwt.sign({id:user.id,name:user.username,img:user.img,email:user.email}, SECRET_KEY, {expiresIn: '1h'});
    res.json({token});
})

app.put("/updateblog",async(req,res)=>{
        const {id,title,content} = req.body
        try {
            const updatedPost = await PostModel.findOneAndUpdate({_id:id},{
                $set:{title:title,content:content},
            })
            if(!updatedPost) {res.status(404).send("Post Not Found")}
            res.send(updatedPost)
        } catch(err){
            res.send(err)
        }

})


app.listen(port,()=>{
    console.log("Server is running")
})