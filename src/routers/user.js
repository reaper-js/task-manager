import express from "express";
import multer from "multer";
import sharp from "sharp";
import auth from "../middleware/auth.js";
import User from "../models/user.js";
import Task from "../models/task.js";


const router = new express.Router();

//create users
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save({runValidators: true});
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
})

//read only one user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

//update user
router.patch('/users/me', auth, async (req, res) => {
    if(!req.user){
        return res.status(404).send('Please Authenticate');
    }
    const updates = Object.keys(req.body);
    const allowed = ['name', 'age', 'password', 'email'];
    // every return true if every value of updates is in allowed
    const isValid = updates.every((update) => {
        return allowed.includes(update);
    });

    if(!isValid){
        return res.status(400).send({Error : 'invalid Updates!'})
    }
    try{

        const user = await req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        //findByIdAndUpdate doesn't work with middleware
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        await user.save();
        res.send(user);
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

//upload the profile picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

//remove profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

//access the profile picture
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }
})



//delete User
router.delete('/users/me',auth, async (req, res) => {
    try{
        await Task.deleteMany({owner: req.user._id});
        await User.deleteOne({_id: req.user._id});
        res.send(req.user);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})

//user login
router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch (e){
        res.status(400).send();
    }
})

//user logout from one device
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

//user logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

export default router;