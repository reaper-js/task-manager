import User from "../models/user.js";
import express from "express";
import auth from "../middleware/auth.js";


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

//read one user
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send(user);
        } 
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
    
})

//update user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['name', 'age', 'password', 'email'];
    // every return true if every value of updates is in allowed
    const isValid = updates.every((update) => {
        return allowed.includes(update);
    });

    if(!isValid){
        return res.status(400).send({Error : 'invalid Updates!'})
    }
    
    const _id = req.params.id
    try{

        const user = await User.findById(_id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        //findByIdAndUpdate doesn't work with middleware
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if(!user){
            return res.status(404).send();
        }
        await user.save();
        res.send(user);
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

//delete User
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
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