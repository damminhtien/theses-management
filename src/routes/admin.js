const Router = require('express-promise-router')
const router = new Router()

module.exports = router

router.get('/', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id == 0) 
		res.render('./admin/aboutus', {usr: req._passport.session.user.ten})
	else res.redirect('/dangnhap')
});

router.get('/social/facebook', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id == 0) 
		res.render('./admin/facebook', {usr: req._passport.session.user.ten})
	else res.redirect('/dangnhap')
});