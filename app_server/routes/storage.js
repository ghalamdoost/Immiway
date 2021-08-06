var express = require('express')
var router = express.Router()
const ctrlAuthentication=require('../controllers/authentication');
const ctrlStorage = require('../controllers/storage');
const { Role } = require('../models/user');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/admin/list/', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlStorage.getList)
router.get('/admin/:filekey', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlStorage.download)
router.post('/admin/new/',ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]),multipartMiddleware, ctrlStorage.addNew)
router.delete('/admin/:docid/remove', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlStorage.remove)

module.exports = router;