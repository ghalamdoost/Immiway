const mongoose = require('mongoose');

const DocumentNotificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    userDocument:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserDocument',
        required: true
    }    
}, {
    timestamps: true
  })

  DocumentNotificationSchema.index({coords: '2dsphere'});
mongoose.model('DocumentNotification', DocumentNotificationSchema);