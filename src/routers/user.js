import User from "../models/user.js";
import express from "express";

const router = new express.Router();

//create users
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save({runValidators: true});
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

//read users
router.get('/users', async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(e){
        res.status(500).send(e);
    }
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
        const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
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

export default router;