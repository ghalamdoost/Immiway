const mongoose = require('mongoose');

const Role =  Object.freeze({
    Admin:'admin',
    Agent:'agent',
    Client:'client'
});

const UserSchema =  new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    age:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    unit:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    postalcodeOrZippCode:String,
    city:{
        type:String,
        required: true
    },
    provinceOrState:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    blogContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BlogContent',
        default : null
    }],
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.Client
    }       
}, {
    timestamps: true
});

Object.assign(UserSchema.statics, {
    Role
})


UserSchema.index({coords: '2dsphere'});
mongoose.model('User', UserSchema);
module.exports = {
    Role
}