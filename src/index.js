import express from "express";
import './db/mongoose.js';
import UserRouter from './routers/user.js';
import TaskRouter from "./routers/task.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);



app.listen(port, () => {
    console.log('Server is up on port '+ port);
})