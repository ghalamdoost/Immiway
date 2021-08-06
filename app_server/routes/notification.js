var express = require('express')
var router = express.Router()
const ctrlAuthentication=require('../controllers/authentication');
const ctrlNotification = require('../controllers/notification');
const { Role } = require('../models/user');



router.get('/allnewcount',ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]),ctrlNotification.allnew);


module.exports = router;