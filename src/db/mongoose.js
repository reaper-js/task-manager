import mongoose from "mongoose";
import validator from "validator";

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.lowercase === 'password' || value.length <= 6){
                throw new Error('Password is invalid!!')
            }
        }
    }
    ,
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Enter a valid Age!!')
            }
        }
    }
});

const Tasks = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const task = new Tasks({
//     description: 'Learn Node',
//     completed: false
// })

const me = new User({
    name: 'Jayza',
    age: 23,
    email: '123@gmail.com',
    password: '123d'
});

me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log('Error', error)
} )

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error', error);
// });
