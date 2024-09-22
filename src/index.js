import express from "express";
import './db/mongoose.js';
import UserRouter from './routers/user.js';
import TaskRouter from "./routers/task.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

// Without Express middleware = new request -> run route handler
// With Express moddleware = new request -> do something -> run route handler


app.listen(port, () => {
    console.log('Server is up on port '+ port);
})