var express = require('express')
var router = express.Router()
const ctrlAuthentication=require('../controllers/authentication');
const ctrlContent = require('../controllers/content');
const { Role } = require('../models/user');


router.get('/listbyparentid/:parentid',ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlContent.getContentList)
router.get('/homenav',ctrlContent.getHomeNavList)
router.get('/nav',ctrlContent.getNavList)
router.get('/:contentid',ctrlContent.getContent)

router.get('/pagebyname/:pageTitle',ctrlContent.getPageByName)



//only admin and agent have eccess to tihs roues

router.get('/pagebyparentid/:parentid',ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]),ctrlContent.getPage)
router.put('/update', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlContent.updateContent)
router.post('/new', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlContent.addNewContent)
router.delete('/remove/:contentid', ctrlAuthentication.AuthenticateToken, ctrlAuthentication.AuthRole([Role.Admin, Role.Agent]), ctrlContent.removeContent)



/***/


module.exports = router;
