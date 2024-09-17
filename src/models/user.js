import mongoose from "mongoose";
import validator from "validator";

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
            if(value.toLowerCase() === 'password' || value.length <= 6){
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


export default User;