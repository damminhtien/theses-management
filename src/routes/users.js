const Router = require('express-promise-router');
const router = new Router();
module.exports = router;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});