const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: 'First Posts',
            content: 'This is the first post!',
            imageUrl: 'images/airplane-background.jpg',
            creator: {
                name: 'Maximilian',
            },
            createdAt: new Date(),
            _id: '1'
        }]
    })
}

exports.createPost = (req, res, next) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array()
        })
    }
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: 'images/airplane-background.jpg',
        creator :{name: 'Maximilian'},
    })
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully!',
            post: result,
        })
    }).catch(err=> console.log(err))


    //Create post in db

}