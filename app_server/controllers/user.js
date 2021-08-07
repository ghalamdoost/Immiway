const mongoose = require('mongoose');
const User= mongoose.model('User');
const {Role}=require('../models/user');
let bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');


let login = (req,res)=>{
    try{
        User.findOne({email:req.body.email}, (err,user)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(user!=null){
                //Authentication
                if(req.body.password!=null && req.body.password!=' '){
                    bcrypt.compare(req.body.password,user.password, (err, resp)=>{
                        if(err){
                            res.status(400).json(err.message);
                        }else if(resp){
                            //JWT 
                            const accessToken= jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET);
                            user.accessToken=accessToken;
                            res.status(200).json({
                                _id:user._id,
                                firstName:user.firstName,
                                lastName:user.lastName,
                                email:user.email,
                                phone:user.phone,
                                age:user.age,
                                unit:user.unit,
                                address:user.address,
                                postalcodeOrZippCode:user.postalcodeOrZippCode,
                                city:user.city,
                                provinceOrState:user.provinceOrState,
                                country:user.country,
                                blogContent:user.blogContent,
                                role:user.role,
                                token:accessToken
                            });
                        }else{
                            res.status(403).json("Password Not Match")
                        }
                    })                  
                }else{
                    res.status(403).json("Enter The Passwords As Well")
                }                            
            }else{
                res.status(404).json("No User Found")
            }
        })
    }catch{
        res.status(500).json();
    }      
}

let register = (req, res)=>{
    try{
        User.findOne({email:req.body.email}, (err,user)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(user!=null){
                res.status(403).json("User Already Exist")
            }else{
                createUser(req, res)
            }
        })
    }catch{
        res.status(500).json();
    }
}

let createUser = (req, res)=>{
    try{
        //create salt to hash password
        const salt= bcrypt.genSalt(10,(err,salt)=>{
            //hash the password
            bcrypt.hash(req.body.password, salt, (err, hash)=>{
                const hashPassword=hash;
                //create new user with the hashed password
                User.create({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    phone:req.body.phone,
                    age:req.body.age,
                    password:hashPassword,
                    unit:req.body.unit,
                    address:req.body.address,
                    postalcodeOrZippCode:req.body.postalcodeOrZippCode,
                    city:req.body.city,
                    provinceOrState:req.body.provinceOrState,
                    country:req.body.country

                    // role:Role.Client
                }, (err,response) => {
                    if(err){
                        res.status(403).json(err.message);
                    }else{
                        res.status(201).json("New user has been registered, now you can request to log in.")
                    }
                })
            })
        })
        
    }catch{
        res.status(500).json();
    }
}


/* Get users */
let getUserList = (req, res)=>{
    try{
        User.find({}, (err,userList)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(userList!=null && userList.length>0){
                res.status(200).json(userList);
            }
        })
    }catch{
        res.status(500).json();
    }
};


let account = (req, res)=>{
    res.status(200).json("good");
}

let admin = (req, res) =>{
    res.status(200).json("good");
}


let updateUserInfo = (req, res)=>{
    try {
        User.findByIdAndUpdate(
            {_id:req.user._id},
            {
                // email:req.user.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                phone:req.body.phone,
                age:req.body.age,
                unit:req.body.unit,
                address:req.body.address,
                postalcodeOrZippCode:req.body.postalcodeOrZippCode,
                city:req.body.city,
                provinceOrState:req.body.provinceOrState,
                country:req.body.country
            },
            { runValidators: true }
        , (err,result,r)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(result!=null){
                res.status(201).json({
                    _id:req.user._id,
                    // email:req.body.email,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    phone:req.body.phone,
                    age:req.body.age,
                    unit:req.body.unit,
                    address:req.body.address,
                    postalcodeOrZippCode:req.body.postalcodeOrZippCode,
                    city:req.body.city,
                    provinceOrState:req.body.provinceOrState,
                    country:req.body.country
                })
            }else{
                res.status(403).json();
            }
        }) 
    } catch{
        res.status(500).json();
    }
}

let setUserRole = (req, res)=>{
    try {
        var selectedRole;
        switch (req.body.role) {
            case Role.Admin:
                selectedRole=Role.Admin;
                break;
                case Role.Client:
                    selectedRole=Role.Client;
                    break;
                case Role.Agent:
                    selectedRole=Role.Agent;
                    break;
            default:
                break;
        }
        
        User.findByIdAndUpdate(
            {_id:req.user._id},
            {
                role: selectedRole
            },
            { runValidators: true }
            , (err,result)=>{
                if(err){
                    res.status(400).json(err.message);
                }else if(result!=null){
                    res.status(200).json("User Role Has Been Updated")
                }else{
                    res.status(403).json();
                }
            }) 
    } catch{
        res.status(500).json();
    }
}

let getUserInfo=(req, res)=>{
    try {
        User.findById({_id:req.user._id}, (err,user)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(user!=null){
                res.status(200).json({
                    _id:user._id,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    phone:user.phone,
                    age:user.age,
                    unit:user.unit,
                    address:user.address,
                    postalcodeOrZippCode:user.postalcodeOrZippCode,
                    city:user.city,
                    provinceOrState:user.provinceOrState,
                    country:user.country,
                    blogContent:user.blogContent,
                    role:user.role
                });
            }else{
                res.status(404).json("No User Found")
            }
        })
    } catch {
        res.status(500).json();
    }
}


let changeUserPassword=(req, res)=>{
    try {
        User.findById({_id:req.user._id}, (err,user)=>{
            if(req.body.password!=null && req.body.password!=' ' && req.body.newPassword!=null && req.body.newPassword!=' '){
                bcrypt.compare(req.body.password,user.password, (err, resp)=>{
                    if(err){
                        res.status(400).json(err.message);
                    }else if(resp){
                        const salt= bcrypt.genSalt(10,(err,salt)=>{
                            //hash the password
                            bcrypt.hash(req.body.newPassword, salt, (err, hash)=>{
                                const hashPassword=hash;
                                User.findByIdAndUpdate({_id:req.user._id},{password:hashPassword},{runValidators: true }, (err,result)=>{
                                    if(err){
                                        res.status(400).json(err.message);
                                    }else if(result!=null){
                                        res.status(200).json("Password Has Been Updated")
                                    }else{
                                        res.status(403).json();
                                    }
                                })
                            })
                        })
                    }else{
                        res.status(403).json("Password Not Match")
                    }
                })
            }else{
                res.status(403).json("Enter Current Passwords As Well")
            }
        })        
    } catch {
        res.status(500).json();
    }
}


let forceChangeUserPassword=(req, res)=>{
    try {
        User.findById({_id:req.user._id}, (err,user)=>{
            if(req.body.newPassword!=null && req.body.newPassword!=' '){
                const salt= bcrypt.genSalt(10,(err,salt)=>{
                    //hash the password
                    bcrypt.hash(req.body.newPassword, salt, (err, hash)=>{
                        const hashPassword=hash;
                        User.findByIdAndUpdate({_id:req.user._id},{password:hashPassword},{runValidators: true }, (err,result)=>{
                            if(err){
                                res.status(400).json(err.message);
                            }else if(result!=null){
                                res.status(200).json("Password Has Been Updated")
                            }else{
                                res.status(403).json();
                            }
                        })
                    })
                })
            }else{
                res.status(403).json("Enter New Password")
            }
        })        
    } catch {
        res.status(500).json();
    }
}


module.exports = {
    getUserList,
    login,
    register,
    account,
    admin,
    updateUserInfo,
    setUserRole,
    getUserInfo,
    changeUserPassword,
    forceChangeUserPassword
};