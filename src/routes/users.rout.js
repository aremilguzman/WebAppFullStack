const {Router} = require('express');
const router = Router();

const {renderSignUpForm, renderSigninForm, signup, signin, logout} = require('../controllers/users.controller');

const {isAuthenticated} = require('../authenticator/validate-auth');
//rutas de los formularios
router.get('/users/signup', isAuthenticated, renderSignUpForm);

router.post('/users/signup', isAuthenticated, signup);

router.get('/users/signin', renderSigninForm);

router.post('/users/signin', signin);

router.get('/users/logout', logout);


module.exports = router;