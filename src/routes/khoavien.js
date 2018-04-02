const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router;

router.get('/danhsach', function(req, res, next) {
    (async() => {
        const client = await pool.connect()
        try {
            const result = await client.query('SELECT * FROM khoavien')
            res.send(result.rows)
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.get('/them', function(req, res, next) {
    res.render("./khoavien/them")
});

router.post('/them', function(req, res, next) {
    const tenkhoavien = req.body.tenkhoavien;
    console.log(req.body);
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("INSERT INTO khoavien (ten_kv,dia_chi) VALUES ('" + tenkhoavien + "','b1')");
            res.redirect('../khoavien/danhsach');
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});