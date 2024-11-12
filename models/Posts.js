const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:100
    },
    content:{
        type:String,
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }
})

const Post = mongoose.model('ecellBlogPosts',PostSchema)

module.exports = Post;