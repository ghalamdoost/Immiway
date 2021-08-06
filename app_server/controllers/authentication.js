require('dotenv').config();
const jwt=require('jsonwebtoken');
const {Role}=require('../models/user');


//midlewares
function AuthenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]

    if(token==null) return res.status(401).json();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(403).json();
        req.user=user.user;
        next();
    })
}

function AuthRole(roleList){
    return (req, res, next) =>{
        if(!roleList.some(x=>x==req.user.role)){
            return res.status(401).json("Not Allowed")
        }
        next()
    }
}

function spyMode(req, res, next){
    if(req.params.userid==null || req.params.userid=='' || req.params.userid=='undefined'){
        if(req.body.userid==null || req.body.userid=='' || req.body.userid=='undefined'){
            return res.status(403).json("Client's  UserId Is Required As Well")
        }else{
            req.user._id=req.body.userid
            if(req.body.formData){
                var temp=req.body.formData;
                delete req.body;
                // delete req.body.formData;
                // delete req.body.userid;
                req.body=temp;
            }
            var s=0
        }   
    }else{
        req.user._id=req.params.userid    
        var s=0    
    }
    
    next()
}

module.exports = {
    AuthenticateToken,
    AuthRole,
    spyMode
};