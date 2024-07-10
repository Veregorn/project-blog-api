#! /usr/bin/env node

console.log(
    'This script populates some user, post and comment instances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

const users = [];
const posts = [];
const comments = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch(err => console.error(err));

async function main() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoDB);
    console.log('Connected to MongoDB');
    await createUsers();
    await createPosts();
    await createComments();
    console.log('Closing MongoDB connection...');
    mongoose.connection.close();
    console.log('Connection closed');
}

async function createUsers() {
    console.log('Creating users...');
    const user1 = new User({
        name: 'user1',
        password: 'password1',
        email: 'user1@mail.com',
        type: 'user',
    });
    await user1.save();
    users.push(user1);

    const user2 = new User({
        name: 'user2',
        password: 'password2',
        email: 'user2@mail.com',
        type: 'user',
    });
    await user2.save();
    users.push(user2);

    const admin = new User({
        name: 'admin',
        password: 'admin',
        email: 'admin@mail.com',
        type: 'admin',
    });
    await admin.save();
    users.push(admin);

    console.log('Users created');
};

async function createPosts() {
    console.log('Creating posts...');
    const post1 = new Post({
        title: 'Title of post 1',
        content: 'Content of post 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam. Nullam nec purus ut nunc ultricies aliquam.',
        published: true,
        created_at: new Date(),
        author: users[2]._id,
    });
    await post1.save();
    posts.push(post1);

    const post2 = new Post({
        title: 'Title of post 2',
        content: 'Content of post 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ut nunc ultricies aliquam.',
        published: true,
        created_at: new Date(),
        author: users[2]._id,
    });
    await post2.save();
    posts.push(post2);

    console.log('Posts created');
}

async function createComments() {
    console.log('Creating comments...');
    const comment1 = new Comment({
        content: 'Comment 1 for post 1',
        post: posts[0]._id,
        timestamp: new Date(),
        user: users[0]._id,
    });
    await comment1.save();
    comments.push(comment1);

    const comment2 = new Comment({
        content: 'Comment 2 for post 1',
        post: posts[0]._id,
        timestamp: new Date(),
        user: users[1]._id,
    });
    await comment2.save();
    comments.push(comment2);

    const comment3 = new Comment({
        content: 'Comment 1 for post 2',
        post: posts[1]._id,
        timestamp: new Date(),
        user: users[0]._id,
    });
    await comment3.save();
    comments.push(comment3);

    console.log('Comments created');
}