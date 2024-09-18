import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisIsToken');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

UserSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({email: email});
    
    if(!user){
        throw new Error('Unable to Login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Uable to Login');
    }
    return user;
}

UserSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', UserSchema);


export default User;