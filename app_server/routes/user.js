var express = require('express')
var router = express.Router()
const ctrlUser = require('../controllers/user')
const ctrlUserDocument = require('../controllers/document')
const ctrlAuthentication=require('../controllers/authentication');
const ctrlStorage = require('../controllers/storage');
const { Role } = require('../models/user');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.post('/login', ctrlUser.login);

router.post('/register', ctrlUser.register)

//each user has eccess to tihs roues, regardles of permission access
router.get('/account', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUser.account);
router.get('/account/info', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUser.getUserInfo);
router.put('/account/updateinfo', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUser.updateUserInfo)
router.put('/account/changepassword', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUser.changeUserPassword)
router.get('/account/documentlist', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUserDocument.getDocumentList)
router.get('/account/document/get/:filekey', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUserDocument.downloadUserDocument)
router.post('/account/document/new', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]),multipartMiddleware, ctrlUserDocument.addNewUserDocument)
// router.put('/account/document/update', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUserDocument.updateUserDocument)
router.delete('/account/document/:docid/remove', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent, Role.Client]), ctrlUserDocument.removeUserDocument)
/***/

//only admin and agent have eccess to tihs roues
router.get('/admin', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin]), ctrlUser.admin);
router.get('/admin/clientlist', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlUser.getUserList);
router.get('/admin/clientinfo/:userid', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUser.getUserInfo);
router.put('/admin/clientinfo/updateinfo', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUser.updateUserInfo);
router.put('/admin/clientinfo/changepassword', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUser.forceChangeUserPassword)
router.put('/admin/clientinfo/setrole', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin]), ctrlAuthentication.spyMode, ctrlUser.setUserRole)
router.get('/admin/clientinfo/:userid/documentlist', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUserDocument.getDocumentList)
router.get('/admin/clientinfo/:userid/documentInfo/:filekey', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlUserDocument.downloadUserDocument)
router.post('/admin/clientinfo/document/new/:userid', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, multipartMiddleware, ctrlUserDocument.addNewUserDocument)
// router.put('/admin/clientinfo/document/update', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUserDocument.updateUserDocument)
router.delete('/admin/clientinfo/:userid/document/:docid/remove', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlAuthentication.spyMode, ctrlUserDocument.removeUserDocument)



/***/


module.exports = router;
