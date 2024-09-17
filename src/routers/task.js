import express from "express";
import Task from "../models/task.js";

const router = new express.Router();

//create tasks
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

//read tasks
router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send(e);
    }
})

//read Task by id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

//update tasks
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['description', 'completed'];
    const isValid = updates.every((update) => {
        return allowed.includes(update);
    });

    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid Updates' });
    }

    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

//delete Task
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findByIdAndDelete(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e) {
        res.status(500).send(e)
    }
})

export default router;