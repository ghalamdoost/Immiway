const mongoose = require('mongoose');
const DocumentNotification= mongoose.model('DocumentNotification');


let create = (userId,docId)=>{
    try {
        DocumentNotification.create({
            userDocument:docId,
            user:userId
        })        
    }catch {
        res.status(500).json();
    }
}

let remove = (docId)=>{
    try {
        DocumentNotification.findOne({userDocument:docId},(err, not)=>{
            if(err){
                console.log(err);
            }else{
                DocumentNotification.findByIdAndRemove({_id:not._id},(er)=>{
                })
            }
        })
    }catch {
        res.status(500).json();
    }
}

let allnew = (req, res)=>{
    try {
        DocumentNotification.find({},(err, resp)=>{
            if(err){
                res.status(403).json(err);
            }else{
                // var notifMap = {};

                // resp.forEach(function(notification) {
                //     notifMap[notification._id] = notification;
                // });
                res.status(200).json(resp.length)
            }
        })
    } catch{
        res.status(500).json();
    }
}


module.exports = {
    create,
    remove,
    allnew
};